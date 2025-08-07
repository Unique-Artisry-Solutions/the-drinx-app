
import { supabase } from '@/integrations/supabase/client';

// Replace all supabaseClient references with supabase
import { sampleEstablishments, sampleCocktails, sampleBarCrawls } from '@/data/sampleData';

export const migrateEstablishments = async () => {
  // Check if establishments already exist
  const { data: existingEstablishments } = await supabase
    .from('establishments')
    .select('id')
    .limit(1);
  
  if (existingEstablishments && existingEstablishments.length > 0) {
    console.log('Establishments already exist in the database');
    return existingEstablishments;
  }
  
  // Insert establishments
  const { data: establishments, error } = await supabase
    .from('establishments')
    .insert(sampleEstablishments.map(est => ({
      name: est.name,
      address: est.address,
      latitude: est.latitude,
      longitude: est.longitude,
      image_url: est.image,
      phone: est.phone,
      website: est.website,
      cocktail_count: est.cocktailCount || 0
    })))
    .select();
  
  if (error) {
    console.error('Error migrating establishments:', error);
    return [];
  }
  
  console.log('Successfully migrated establishments:', establishments?.length);
  return establishments;
};

export const migrateCocktails = async () => {
  // Check if cocktails already exist
  const { data: existingCocktails } = await supabase
    .from('cocktails')
    .select('id')
    .limit(1);
  
  if (existingCocktails && existingCocktails.length > 0) {
    console.log('Cocktails already exist in the database');
    return existingCocktails;
  }
  
  // Get establishments to map IDs
  const { data: establishments } = await supabase
    .from('establishments')
    .select('id, name');
  
  if (!establishments || establishments.length === 0) {
    console.error('No establishments found, cannot migrate cocktails');
    return [];
  }
  
  // Create a mapping from establishment name to ID
  const establishmentMap = new Map(
    establishments.map(est => [est.name.toLowerCase(), est.id])
  );
  
  // Insert cocktails
  const cocktailsToInsert = sampleCocktails
    .filter(cocktail => {
      const estName = cocktail.establishment.name.toLowerCase();
      return establishmentMap.has(estName);
    })
    .map(cocktail => {
      const estName = cocktail.establishment.name.toLowerCase();
      const priceValue = typeof cocktail.price === 'string' 
        ? cocktail.price 
        : `$${parseFloat(String(cocktail.price)).toFixed(2)}`;
      
      return {
        name: cocktail.name,
        price: priceValue,
        description: cocktail.description,
        ingredients: cocktail.ingredients,
        image_url: cocktail.image,
        establishment_id: establishmentMap.get(estName)
      };
    });
  
  const { data: cocktails, error } = await supabase
    .from('cocktails')
    .insert(cocktailsToInsert)
    .select();
  
  if (error) {
    console.error('Error migrating cocktails:', error);
    return [];
  }
  
  console.log('Successfully migrated cocktails:', cocktails?.length);
  return cocktails;
};

export const migrateThemes = async () => {
  // Check if themes already exist
  const { data: existingThemes } = await supabase
    .from('bar_crawl_themes')
    .select('id')
    .limit(1);
  
  if (existingThemes && existingThemes.length > 0) {
    console.log('Themes already exist in the database');
    return existingThemes;
  }
  
  // Create sample themes
  const themes = [
    { name: 'Tropical Escape', description: 'Experience tropical vibes with refreshing mocktails' },
    { name: 'Spice Journey', description: 'Explore spice-infused non-alcoholic drinks' },
    { name: 'Local Flavors', description: 'Taste the best local ingredients in creative mocktails' },
    { name: 'Classic Revival', description: 'Traditional cocktails reimagined without alcohol' },
    { name: 'Wellness Tour', description: 'Health-focused drinks with functional ingredients' }
  ];
  
  const { data: insertedThemes, error } = await supabase
    .from('bar_crawl_themes')
    .insert(themes)
    .select();
  
  if (error) {
    console.error('Error migrating themes:', error);
    return [];
  }
  
  console.log('Successfully migrated themes:', insertedThemes?.length);
  return insertedThemes;
};

export const migrateBarCrawls = async () => {
  // Check if bar crawls already exist
  const { data: existingBarCrawls } = await supabase
    .from('bar_crawls')
    .select('id')
    .limit(1);
  
  if (existingBarCrawls && existingBarCrawls.length > 0) {
    console.log('Bar crawls already exist in the database');
    return existingBarCrawls;
  }
  
  // Get themes and establishments for reference
  const { data: themes } = await supabase
    .from('bar_crawl_themes')
    .select('id, name');
  
  const { data: establishments } = await supabase
    .from('establishments')
    .select('id, name');
  
  if (!themes || !establishments) {
    console.error('Missing themes or establishments, cannot migrate bar crawls');
    return [];
  }
  
  // Create theme map
  const themeMap = new Map(
    themes.map(theme => [theme.name.toLowerCase(), theme.id])
  );
  
  // Create establishment map
  const establishmentMap = new Map(
    establishments.map(est => [est.name.toLowerCase(), est.id])
  );
  
  // Insert bar crawls
  const barCrawlsToInsert = sampleBarCrawls.map(crawl => {
    // Pick a random theme
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    return {
      name: crawl.name,
      description: crawl.description || `Explore the best mocktail spots with ${crawl.name}`,
      organizer_id: crawl.organizer || '00000000-0000-0000-0000-000000000000',
      start_date: crawl.date || new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      theme_id: randomTheme.id,
      status: 'active'
    };
  });
  
  const { data: barCrawls, error } = await supabase
    .from('bar_crawls')
    .insert(barCrawlsToInsert)
    .select();
  
  if (error) {
    console.error('Error migrating bar crawls:', error);
    return [];
  }
  
  // Add establishments to bar crawls
  if (barCrawls && barCrawls.length > 0) {
    // For each bar crawl, select random establishments
    const barCrawlEstablishments = [];
    
    for (const crawl of barCrawls) {
      // Randomly select 3-5 establishments
      const numEstablishments = Math.floor(Math.random() * 3) + 3; // 3-5 establishments
      const selectedEstablishments = establishments
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, numEstablishments);
      
      // Create records for bar_crawl_establishments
      selectedEstablishments.forEach((est, index) => {
        barCrawlEstablishments.push({
          bar_crawl_id: crawl.id,
          establishment_id: est.id,
          order_position: index + 1,
          status: 'confirmed'
        });
      });
    }
    
    // Insert bar crawl establishments
    const { error: estError } = await supabase
      .from('bar_crawl_establishments')
      .insert(barCrawlEstablishments);
    
    if (estError) {
      console.error('Error adding establishments to bar crawls:', estError);
    } else {
      console.log('Successfully added establishments to bar crawls');
    }
  }
  
  console.log('Successfully migrated bar crawls:', barCrawls?.length);
  return barCrawls;
};

export const migrateAllData = async () => {
  try {
    console.log('Starting data migration to Supabase...');
    await migrateEstablishments();
    await migrateCocktails();
    await migrateThemes();
    await migrateBarCrawls();
    console.log('Data migration complete!');
    return true;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
};
