const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Ramesh Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
  },
  {
    name: 'Suresh Farmer',
    email: 'farmer@example.com',
    password: 'password123',
    role: 'farmer',
  },
];

const products = [
  {
    name: 'HD-2967 High Yield Wheat Seeds',
    price: 250,
    description: 'A very popular high yielding wheat variety suitable for timely sown irrigated conditions. High resistance to yellow rust.',
    category: 'seeds',
    stock: 150,
    image: 'https://placehold.co/600x400/2D6A4F/FFF?text=Wheat+Seeds',
  },
  {
    name: 'Pusa Basmati 1121 Rice Seeds',
    price: 320,
    description: 'Extra long slender grain, highly aromatic, and excellent cooking quality. Matures in 140-145 days.',
    category: 'seeds',
    stock: 80,
    image: 'https://placehold.co/600x400/2D6A4F/FFF?text=Basmati+Rice+Seeds',
  },
  {
    name: 'NPK 19-19-19 Water Soluble Fertilizer',
    price: 1650,
    description: '100% water soluble balanced NPK fertilizer. Ideal for foliar spray and drip irrigation. Promotes healthy overall growth.',
    category: 'fertilizers',
    stock: 45,
    image: 'https://placehold.co/600x400/BC8A5F/FFF?text=NPK+Fertilizer',
  },
  {
    name: 'DAP (Di-Ammonium Phosphate) 50kg',
    price: 1350,
    description: 'Most widely used phosphorus fertilizer. Excellent source of P and N for basal application for all crops.',
    category: 'fertilizers',
    stock: 120,
    image: 'https://placehold.co/600x400/BC8A5F/FFF?text=DAP+Fertilizer',
  },
  {
    name: 'Pioneer P3396 Hybrid Corn Seeds',
    price: 850,
    description: 'High yielding maize hybrid. Highly tolerant to moisture stress and major diseases. Orange yellow semi-flint grain.',
    category: 'seeds',
    stock: 60,
    image: 'https://placehold.co/600x400/2D6A4F/FFF?text=Corn+Seeds',
  },
  {
    name: 'Organic Neem Cake Fertilizer 5kg',
    price: 250,
    description: '100% organic fertilizer and pest repellent. Rich in N-P-K and protects plant roots from nematodes and soil grubs.',
    category: 'fertilizers',
    stock: 200,
    image: 'https://placehold.co/600x400/BC8A5F/FFF?text=Neem+Cake',
  },
  {
    name: 'Arka Rakshak F1 Tomato Seeds',
    price: 2500,
    description: 'High yielding F1 hybrid tomato. Triple disease resistant (ToLCV, Bacterial wilt, Early blight).',
    category: 'seeds',
    stock: 30,
    image: 'https://placehold.co/600x400/2D6A4F/FFF?text=Tomato+Seeds',
  },
  {
    name: 'Urea (46% Nitrogen) 45kg',
    price: 267,
    description: 'Neem coated urea, provides steady supply of nitrogen. Essential for rapid vegetative growth.',
    category: 'fertilizers',
    stock: 300,
    image: 'https://placehold.co/600x400/BC8A5F/FFF?text=Urea',
  }
];

module.exports = { users, products };
