import { supabase } from '@/integrations/supabase/client';
import { SwigCircuit, SwigCircuitAttendee, SwigCircuitCheckIn } from '@/types/SwigCircuitTypes';
import { incrementCodeUsage } from '@/utils/serviceUtils';

// Your swig circuit service code here...
// This is just a placeholder since we don't have the full file

export const applyDiscountToCircuitTicket = async (circuitId: string, discountId: string): Promise<boolean> => {
  // Example implementation
  try {
    // Apply the discount
    // Implementation details would go here
    
    // Increment the discount code usage
    await incrementCodeUsage(discountId);
    
    return true;
  } catch (error) {
    console.error("Error applying discount to circuit ticket:", error);
    return false;
  }
};

/**
 * Check in an attendee to a swig circuit
 * @param attendeeId The ID of the attendee
 * @param circuitId The ID of the swig circuit
 * @param establishmentId The ID of the establishment where check-in occurs
 * @param checkedInBy Optional ID of the user performing the check-in
 * @returns Promise<boolean> indicating success or failure
 */
export const checkInSwigCircuitAttendee = async (
  attendeeId: string,
  circuitId: string,
  establishmentId: string,
  checkedInBy?: string
): Promise<boolean> => {
  try {
    // First, update the attendee record to mark them as checked in if not already
    const { data: attendee, error: fetchError } = await supabase
      .from('swig_circuit_attendees')
      .select('checked_in_at, first_check_in')
      .eq('id', attendeeId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching attendee:", fetchError);
      return false;
    }
    
    // If this is their first check-in ever, update both fields
    if (!attendee.first_check_in) {
      const { error: updateError } = await supabase
        .from('swig_circuit_attendees')
        .update({
          checked_in_at: new Date().toISOString(),
          first_check_in: new Date().toISOString(),
          status: 'checked_in'
        })
        .eq('id', attendeeId);
        
      if (updateError) {
        console.error("Error updating attendee check-in status:", updateError);
        return false;
      }
    } else {
      // Otherwise just update the last check-in time
      const { error: updateError } = await supabase
        .from('swig_circuit_attendees')
        .update({
          checked_in_at: new Date().toISOString(),
          status: 'checked_in'
        })
        .eq('id', attendeeId);
        
      if (updateError) {
        console.error("Error updating attendee check-in status:", updateError);
        return false;
      }
    }
    
    // Create a check-in record for this specific venue
    const checkInData: Partial<SwigCircuitCheckIn> = {
      swig_circuit_id: circuitId,
      attendee_id: attendeeId,
      establishment_id: establishmentId,
      checked_in_at: new Date().toISOString()
    };
    
    // Add the checked_in_by field if provided
    if (checkedInBy) {
      checkInData.checked_in_by = checkedInBy;
    }
    
    const { error: insertError } = await supabase
      .from('swig_circuit_check_ins')
      .insert(checkInData);
      
    if (insertError) {
      console.error("Error recording check-in:", insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in checkInSwigCircuitAttendee:", error);
    return false;
  }
};

// Additional swig circuit service functions would go here
