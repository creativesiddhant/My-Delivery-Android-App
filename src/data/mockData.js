/**
 * mockData.js - Application Database (Local Dummy Data)
 * 
 * Acting as a senior mobile product engineer, this module encapsulates all static datasets
 * for our marketplace, structured in standard JSON schemas.
 * Under normal production circumstances, these schemas align with what would be fetched
 * from real REST or GraphQL endpoints.
 */

// Services offered on the home dashboard screen
export const marketplaceServices = [
  {
    id: 'food',
    title: 'Food Delivery',
    subtitle: 'Top eats, fast',
    icon: '🍔',
    badge: 'Free Delivery',
    color: '#FF6B35',
    bgColor: 'rgba(255, 107, 53, 0.1)',
  },
  {
    id: 'grocery',
    title: 'Instant Grocery',
    subtitle: 'Delivered in 10m',
    icon: '🥦',
    badge: '10% OFF',
    color: '#2EC4B6',
    bgColor: 'rgba(46, 196, 182, 0.1)',
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy Express',
    subtitle: 'Meds & wellness',
    icon: '💊',
    badge: '24/7',
    color: '#E71D36',
    bgColor: 'rgba(231, 29, 54, 0.1)',
  },
  {
    id: 'courier',
    title: 'Instant Genie',
    subtitle: 'Send anything',
    icon: '⚡',
    badge: 'Within City',
    color: '#FF9F1C',
    bgColor: 'rgba(255, 159, 28, 0.1)',
  }
];

// Active promo banners for the carousel
export const promotionalBanners = [
  {
    id: 'promo_1',
    title: 'Gourmet Weekend Feast',
    subtitle: 'Get 50% off on premium dining experiences',
    code: 'FEAST50',
    color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    buttonText: 'Order Now',
    service: 'food'
  },
  {
    id: 'promo_2',
    title: 'Blink Grocery Express',
    subtitle: 'Super fresh organic greens delivered at your door step',
    code: 'GREEN15',
    color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    buttonText: 'Shop Fresh',
    service: 'grocery'
  },
  {
    id: 'promo_3',
    title: 'Wellness Essentials',
    subtitle: 'Flat 20% off on all prescription medications & vitamins',
    code: 'HEALTH20',
    color: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    buttonText: 'Explore Meds',
    service: 'pharmacy'
  }
];

// Restaurant items for the Food Delivery vertical
export const restaurants = [
  {
    id: 'rest_1',
    name: 'BiteCraft Gourmet Burgers',
    cuisine: 'American • Burgers • Fast Food',
    rating: 4.8,
    reviewsCount: '2.5k+',
    deliveryTime: '15-25 min',
    distance: '1.8 km',
    costForTwo: '$30',
    freeDelivery: true,
    tags: ['Best Seller', 'Trending'],
    featuredImage: '🍔',
    accentColor: '#FF6B35',
    menu: [
      {
        id: 'food_1_1',
        name: 'The Truffle Artisan Burger',
        description: 'Prime Angus beef patty, black truffle aioli, melted swiss gruyere, wild caramelized mushrooms on a toasted brioche bun.',
        price: 14.99,
        rating: 4.9,
        isVeg: false,
        isBestSeller: true,
        category: 'Signature Burgers',
        customizations: [
          {
            name: 'Select Size',
            required: true,
            options: [
              { name: 'Single Patty', extraPrice: 0 },
              { name: 'Double Patty', extraPrice: 3.50 },
              { name: 'Triple Stack', extraPrice: 6.00 }
            ]
          },
          {
            name: 'Add-ons',
            required: false,
            options: [
              { name: 'Applewood Bacon', extraPrice: 1.50 },
              { name: 'Extra Truffle Cheese', extraPrice: 1.00 },
              { name: 'Fried Cage-Free Egg', extraPrice: 1.25 }
            ]
          }
        ]
      },
      {
        id: 'food_1_2',
        name: 'Spicy Avocado Crunch Burger',
        description: 'Crispy plant-based patty, jalapeño lime spread, fresh Hass avocado mash, heirloom tomatoes, and crisp butter lettuce.',
        price: 13.49,
        rating: 4.7,
        isVeg: true,
        isBestSeller: false,
        category: 'Signature Burgers',
        customizations: [
          {
            name: 'Cheese Option',
            required: true,
            options: [
              { name: 'Vegan Cheddar', extraPrice: 0 },
              { name: 'Pepperjack', extraPrice: 0 },
              { name: 'No Cheese', extraPrice: 0 }
            ]
          }
        ]
      },
      {
        id: 'food_1_3',
        name: 'Truffle Parmesan Hand-Cut Fries',
        description: 'Twice-fried Idaho potatoes tossed in premium truffle oil, sea salt, freshly grated parmigiano-reggiano, and chopped rosemary.',
        price: 6.49,
        rating: 4.8,
        isVeg: true,
        isBestSeller: true,
        category: 'Sides & Sharables'
      },
      {
        id: 'food_1_4',
        name: 'Madagascar Bourbon Vanilla Shake',
        description: 'Thick, premium ice cream churned with organic Madagascar vanilla beans, topped with fresh whipped cream and a cherry.',
        price: 5.99,
        rating: 4.6,
        isVeg: true,
        isBestSeller: false,
        category: 'Beverages'
      }
    ]
  },
  {
    id: 'rest_2',
    name: 'La Piazza Pizzeria',
    cuisine: 'Italian • Artisanal Pizza • Pasta',
    rating: 4.7,
    reviewsCount: '1.8k+',
    deliveryTime: '20-30 min',
    distance: '2.4 km',
    costForTwo: '$40',
    freeDelivery: false,
    deliveryFee: 1.99,
    tags: ['Top Rated'],
    featuredImage: '🍕',
    accentColor: '#E71D36',
    menu: [
      {
        id: 'food_2_1',
        name: 'Diavola Calabrese Pizza',
        description: 'San Marzano tomato base, fresh fior di latte mozzarella, spicy Calabrian salami, house-infused hot honey, and fresh basil.',
        price: 17.99,
        rating: 4.9,
        isVeg: false,
        isBestSeller: true,
        category: 'Wood-Fired Pizza',
        customizations: [
          {
            name: 'Select Size',
            required: true,
            options: [
              { name: 'Personal 10"', extraPrice: 0 },
              { name: 'Sharing 14"', extraPrice: 4.99 }
            ]
          },
          {
            name: 'Crust Type',
            required: true,
            options: [
              { name: 'Traditional Neapolitan', extraPrice: 0 },
              { name: 'Gluten-Free Crust', extraPrice: 2.50 }
            ]
          }
        ]
      },
      {
        id: 'food_2_2',
        name: 'Burrata & Wild Pesto Pizza',
        description: 'Creamy artisanal burrata ball, pumpkin-seed basil pesto, oven-roasted cherry tomatoes, and toasted pine nuts.',
        price: 18.49,
        rating: 4.8,
        isVeg: true,
        isBestSeller: true,
        category: 'Wood-Fired Pizza'
      },
      {
        id: 'food_2_3',
        name: 'Truffle Mushroom Fettuccine',
        description: 'Handmade egg fettuccine tossed in a rich butter-parmesan sauce with wild porcini mushrooms, finished with fresh parsley.',
        price: 15.99,
        rating: 4.6,
        isVeg: true,
        isBestSeller: false,
        category: 'Artisanal Pasta'
      }
    ]
  },
  {
    id: 'rest_3',
    name: 'WabiSabi Premium Sushi',
    cuisine: 'Japanese • Sushi • Asian Fusion',
    rating: 4.9,
    reviewsCount: '900+',
    deliveryTime: '25-35 min',
    distance: '3.1 km',
    costForTwo: '$60',
    freeDelivery: true,
    tags: ['Fine Dining', 'Super Fast'],
    featuredImage: '🍣',
    accentColor: '#2EC4B6',
    menu: [
      {
        id: 'food_3_1',
        name: 'Signature Dragon Roll',
        description: 'Shrimp tempura and cucumber topped with spicy tuna, thin slices of fresh avocado, unagi eel sauce, and microgreens.',
        price: 16.99,
        rating: 4.9,
        isVeg: false,
        isBestSeller: true,
        category: 'Special Rolls'
      },
      {
        id: 'food_3_2',
        name: 'Matcha Infused Tonkotsu Ramen',
        description: '24-hour slow-cooked pork broth with a touch of matcha green tea, served with chashu pork, soft-boiled egg, bamboo shoots, and nori.',
        price: 15.49,
        rating: 4.7,
        isVeg: false,
        isBestSeller: false,
        category: 'Ramen & Mains'
      },
      {
        id: 'food_3_3',
        name: 'Agedashi Crispy Tofu',
        description: 'Deep-fried silken tofu cubes in a savory, warm dashi-tsuyu broth topped with grated daikon radishes and green onions.',
        price: 8.99,
        rating: 4.5,
        isVeg: true,
        isBestSeller: false,
        category: 'Appetizers'
      }
    ]
  }
];

// Grocery categories and inventory for Instant Grocery
export const groceryCategories = [
  {
    id: 'g_cat_1',
    name: 'Fresh Vegetables & Fruits',
    icon: '🍎',
    items: [
      { id: 'g_item_1_1', name: 'Organic Hass Avocados', weight: '3 pcs', price: 4.49, rating: 4.8, count: 18, image: '🥑' },
      { id: 'g_item_1_2', name: 'Premium Hydroponic Spinach', weight: '200g', price: 2.29, rating: 4.6, count: 24, image: '🥬' },
      { id: 'g_item_1_3', name: 'Sweet Red Cherries', weight: '500g', price: 6.99, rating: 4.9, count: 8, image: '🍒' },
      { id: 'g_item_1_4', name: 'Heirloom Beefsteak Tomatoes', weight: '500g', price: 3.19, rating: 4.5, count: 15, image: '🍅' }
    ]
  },
  {
    id: 'g_cat_2',
    name: 'Dairy, Eggs & Bread',
    icon: '🥛',
    items: [
      { id: 'g_item_2_1', name: 'Grass-Fed Whole Milk 3.5%', weight: '1 Gal', price: 3.99, rating: 4.7, count: 30, image: '🥛' },
      { id: 'g_item_2_2', name: 'Organic Free-Range Large Eggs', weight: '12 pcs', price: 4.89, rating: 4.9, count: 40, image: '🥚' },
      { id: 'g_item_2_3', name: 'Sourdough Country Bread', weight: '500g', price: 3.49, rating: 4.8, count: 12, image: '🍞' }
    ]
  },
  {
    id: 'g_cat_3',
    name: 'Snacks & Premium Chocolates',
    icon: '🍫',
    items: [
      { id: 'g_item_3_1', name: 'Himalayan Pink Salt Kettle Chips', weight: '150g', price: 2.79, rating: 4.4, count: 50, image: '🍟' },
      { id: 'g_item_3_2', name: '85% Single-Origin Dark Chocolate', weight: '80g', price: 3.99, rating: 4.8, count: 20, image: '🍫' }
    ]
  }
];

// Pharmacy inventory for Pharmacy Express
export const pharmacyProducts = [
  {
    id: 'ph_cat_1',
    name: 'Daily Essentials & Wellness',
    icon: '🧼',
    items: [
      { id: 'ph_1_1', name: 'Multivitamin Complex for Adults', size: '60 capsules', price: 18.99, requiresRx: false, rating: 4.7, image: '💊' },
      { id: 'ph_1_2', name: 'Electrolyte Hydration Tablets', size: '10 tablets', price: 6.49, requiresRx: false, rating: 4.5, image: '🥤' }
    ]
  },
  {
    id: 'ph_cat_2',
    name: 'First Aid & OTC Relief',
    icon: '🩹',
    items: [
      { id: 'ph_2_1', name: 'Rapid Relief Pain Killer (Ibuprofen)', size: '20 tablets', price: 5.99, requiresRx: false, rating: 4.6, image: '🩹' },
      { id: 'ph_2_2', name: 'Advanced Cooling Allergy Syrup', size: '120 ml', price: 11.49, requiresRx: false, rating: 4.4, image: '🧪' }
    ]
  }
];

// Initial user profile addresses for marketplace checkout simulation
export const userAddresses = [
  {
    id: 'addr_1',
    label: 'Home',
    icon: '🏠',
    details: 'Penthouse B, SkyHigh Heights, 42 Boulevard Avenue, Downtown'
  },
  {
    id: 'addr_2',
    label: 'Office',
    icon: '🏢',
    details: 'Level 14, Apex Tech Towers, Sector 6, Innovation District'
  }
];
