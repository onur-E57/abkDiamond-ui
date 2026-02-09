// src/api/mockData.js

export const mockCategories = [
    { id: '1', name: 'Yüzük', description: 'Altın ve pırlanta yüzükler' },
    { id: '2', name: 'Kolye', description: 'Zarif kolyeler' },
    { id: '3', name: 'Küpe', description: 'Işıltılı küpeler' },
    { id: '4', name: 'Bileklik', description: 'Modern bileklikler' },
    { id: '5', name: 'Alyans', description: 'Özel tasarım alyanslar' }
];

export const mockProducts = [
    {
        id: '101',
        name: 'Baget Pırlanta Yüzük',
        price: 18500,
        description: '0.50 karat baget pırlanta ve 14 ayar altın.',
        imageUrls: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        categoryId: '1',
        metalType: 'Gold',
        purity: '14K',
        weight: 2.5,
        stock: 15,
        active: true,
        category: { id: '1', name: 'Yüzük' }
    },
    {
        id: '102',
        name: 'Sonsuzluk Altın Kolye',
        price: 4200,
        description: 'Sonsuzluk figürlü, zarif 14 ayar altın kolye.',
        imageUrls: ['https://media.istockphoto.com/id/2197367846/photo/elegant-silver-necklace-with-clear-gemstone-close-up.webp?a=1&b=1&s=612x612&w=0&k=20&c=ljjyzT2Hy9yYQPXXrSrlEmN_G1c5lUzyZuBXp5Jaelc='],
        categoryId: '2',
        metalType: 'Gold',
        purity: '14K',
        weight: 1.8,
        stock: 50,
        active: true,
        category: { id: '2', name: 'Kolye' }
    },
    {
        id: '103',
        name: 'Tektaş Gümüş Küpe',
        price: 850,
        description: '925 ayar gümüş üzerine zirkon taşlı tektaş küpe.',
        imageUrls: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        categoryId: '3',
        metalType: 'Silver',
        purity: '925',
        weight: 1.2,
        stock: 100,
        active: true,
        category: { id: '3', name: 'Küpe' }
    },
    {
        id: '104',
        name: 'Su Yolu Pırlanta Bileklik',
        price: 45000,
        description: 'Toplam 2.00 karat pırlanta taşlı su yolu bileklik.',
        imageUrls: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        categoryId: '4',
        metalType: 'Gold',
        purity: '18K',
        weight: 8.5,
        stock: 3,
        active: true,
        category: { id: '4', name: 'Bileklik' }
    },
    {
        id: '105',
        name: 'Klasik Alyans Çifti',
        price: 12000,
        description: 'Sade ve şık, bombeli klasik altın alyans.',
        imageUrls: ['https://images.unsplash.com/photo-1630326844982-9b35b01cfe59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlcyUyMHdlZGRpbmclMjByaW5nfGVufDB8fDB8fHww'],
        categoryId: '5',
        metalType: 'Gold',
        purity: '22K',
        weight: 6.0,
        stock: 20,
        active: true,
        category: { id: '5', name: 'Alyans' }
    },
    {
        id: '106',
        name: 'Safir Taşlı Vintage Yüzük',
        price: 22500,
        description: 'Mavi safir ve pırlanta detaylı vintage tasarım.',
        imageUrls: ['https://media.istockphoto.com/id/1357417259/photo/closeup-of-luxury-wedding-ring-in-dark-blue-glitter-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=W1Ur38QIyTKT8KcGBoQRwjjJayYz05FzQa-91MJfeVw='],
        categoryId: '1',
        metalType: 'Gold',
        purity: '18K',
        weight: 3.2,
        stock: 8,
        active: true,
        category: { id: '1', name: 'Yüzük' }
    }
];