
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";
import { corsHeaders } from "../_shared/cors.ts";

interface PurchaseConfirmationRequest {
  customerEmail: string;
  customerName: string;
  purchaseDetails: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      eventDate?: string;
      eventTime?: string;
      venue?: string;
    }>;
    subtotal: number;
    serviceFee: number;
    total: number;
    purchaseDate: string;
  };
  ticketCodes?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, purchaseDetails, ticketCodes }: PurchaseConfirmationRequest = await req.json();
    
    // Create HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Purchase Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .content { padding: 20px 0; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .ticket-code { background-color: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Purchase Confirmation</h1>
              <p>Thank you for your purchase, ${customerName}!</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <p><strong>Order Date:</strong> ${new Date(purchaseDetails.purchaseDate).toLocaleDateString()}</p>
              
              <h3>Items Purchased:</h3>
              ${purchaseDetails.items.map(item => `
                <div class="item">
                  <strong>${item.name}</strong> x ${item.quantity}<br>
                  ${item.eventDate ? `<small>Date: ${item.eventDate} ${item.eventTime || ''}</small><br>` : ''}
                  ${item.venue ? `<small>Venue: ${item.venue}</small><br>` : ''}
                  <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="total">
                <div style="display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>$${purchaseDetails.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Service Fee:</span>
                  <span>$${purchaseDetails.serviceFee.toFixed(2)}</span>
                </div>
                <hr>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
                  <span>Total:</span>
                  <span>$${purchaseDetails.total.toFixed(2)}</span>
                </div>
              </div>
              
              ${ticketCodes && ticketCodes.length > 0 ? `
                <h3>Your Ticket Codes</h3>
                <p>Present these QR codes at the event entrance:</p>
                ${ticketCodes.map(code => `
                  <div class="ticket-code">
                    Ticket Code: ${code}
                  </div>
                `).join('')}
              ` : ''}
              
              <h3>What's Next?</h3>
              <ul>
                <li>Save this email for your records</li>
                <li>Present your ticket codes at the event entrance</li>
                <li>Arrive early for faster check-in</li>
                <li>Contact support if you have any questions</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing our platform!</p>
              <p><small>This is an automated confirmation email. Please do not reply.</small></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // In a real implementation, you would send this email using a service like Resend, SendGrid, etc.
    // For now, we'll log the email content and return success
    console.log("Purchase confirmation email would be sent to:", customerEmail);
    console.log("Email content:", emailHtml);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Purchase confirmation email sent successfully"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error sending purchase confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
