export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  type:
    | "veg"
    | "non-veg"
    | "drinks"
    | "dessert"
    | "biryani"
    | "bread"
    | "starter";
  isSpecial: boolean;
}

export const menuItems: MenuItem[] = [
  // Vegetarian Dishes
  {
    id: "v1",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a rich, spiced tomato gravy",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    rating: 4.7,
    category: "Main Course",
    type: "veg",
    isSpecial: true,
  },
  {
    id: "v2",
    name: "Vegetable Biryani",
    description:
      "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
    rating: 4.5,
    category: "Rice",
    type: "veg",
    isSpecial: false,
  },
  {
    id: "v3",
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked with butter and spices",
    price: 349,
    image:
      "https://imgs.search.brave.com/1et60XQxwSWxFjrzWrDZi8h3d6ydjNC6NRlytpil_wo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kYWwtbWFraGFu/aS13aXRoLXdob2xl/LXNwaWNlcy1nYXJu/aXNoXzExMTQ3MTAt/MjUzMTM0LmpwZz9z/ZW10PWFpc19oeWJy/aWQ",
    rating: 4.6,
    category: "Main Course",
    type: "veg",
    isSpecial: false,
  },
  {
    id: "v4",
    name: "Chana Masala",
    description:
      "Chickpeas cooked in a spicy tomato-based sauce with Indian spices",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
    rating: 4.4,
    category: "Main Course",
    type: "veg",
    isSpecial: false,
  },
  {
    id: "v5",
    name: "Palak Paneer",
    description: "Cottage cheese cubes in a creamy spinach sauce",
    price: 399,
    image:
      "https://imgs.search.brave.com/qUfHWtwJR7YkfFevV5v3-HK7Vmi55JTqYMRHrJAOCms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zcGluYWNoLXBh/bmVlci13b25kZXJf/MTE3OTEzMC02OTQy/MC5qcGc_c2VtdD1h/aXNfaHlicmlk",
    rating: 4.5,
    category: "Main Course",
    type: "veg",
    isSpecial: true,
  },
  {
    id: "v6",
    name: "Malai Kofta",
    description: "Potato and paneer dumplings in a rich, creamy tomato sauce",
    price: 449,
    image:
      "https://imgs.search.brave.com/Huq0whQaKk_oUhtlEVZxeYgYA8i-PR3M-bix0et4K2U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzI0LzM1LzU5/LzM2MF9GXzgyNDM1/NTk4N19DR3Fkc3JR/NmpkVVphVjRRWnhD/ZTRmZW50U1hab2da/eC5qcGc",
    rating: 4.7,
    category: "Main Course",
    type: "veg",
    isSpecial: true,
  },
  {
    id: "v7",
    name: "Aloo Gobi",
    description: "Potatoes and cauliflower cooked with Indian spices",
    price: 349,
    image:
      "https://imgs.search.brave.com/_LhDAJs6VjMIJR-wkEKVPMlfzLlxJVd_jIsqM0d13xI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/b2xpdmVhbmRtYW5n/by5jb20vaW1hZ2Vz/L3VwbG9hZHMvMjAy/Ml8wM18yMl9hbG9v/X2dvYmlfMi5qcGc",
    rating: 4.3,
    category: "Main Course",
    type: "veg",
    isSpecial: false,
  },

  // Non-Vegetarian Dishes
  {
    id: "nv1",
    name: "Butter Chicken",
    description:
      "Tender chicken in a rich, creamy tomato sauce with aromatic spices",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80",
    rating: 4.8,
    category: "Main Course",
    type: "non-veg",
    isSpecial: true,
  },
  {
    id: "nv2",
    name: "Chicken Tikka",
    description: "Marinated chicken pieces grilled in a tandoor",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80",
    rating: 4.6,
    category: "Starter",
    type: "starter",
    isSpecial: false,
  },
  {
    id: "nv3",
    name: "Lamb Rogan Josh",
    description: "Tender lamb pieces cooked in a rich, aromatic Kashmiri gravy",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&q=80",
    rating: 4.6,
    category: "Main Course",
    type: "non-veg",
    isSpecial: false,
  },
  {
    id: "nv4",
    name: "Fish Curry",
    description: "Fresh fish fillets simmered in a tangy coconut curry sauce",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1626508035297-0cd27c397d67?w=500&q=80",
    rating: 4.5,
    category: "Main Course",
    type: "non-veg",
    isSpecial: false,
  },
  {
    id: "nv5",
    name: "Chicken Korma",
    description: "Chicken pieces in a mild, creamy sauce with nuts and spices",
    price: 499,
    image:
      "https://imgs.search.brave.com/yxwZmENfW3Fxyl_Q0komABB9cbzHnn8gL075veXSjwA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ncmVh/dGN1cnJ5cmVjaXBl/cy5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDQvdGh1/bWIzLmpwZw",
    rating: 4.7,
    category: "Main Course",
    type: "non-veg",
    isSpecial: false,
  },
  {
    id: "nv6",
    name: "Tandoori Chicken",
    description:
      "Whole chicken marinated in yogurt and spices, roasted in a tandoor",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&q=80",
    rating: 4.8,
    category: "Main Course",
    type: "non-veg",
    isSpecial: true,
  },
  {
    id: "nv7",
    name: "Prawn Masala",
    description: "Succulent prawns cooked in a spicy tomato-based sauce",
    price: 649,
    image:
      "https://imgs.search.brave.com/jvdmz2aeFWSziZorU88BmI1XyM6sUcn1603VQNTNZkE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTQv/ODg0LzgxOC9zbWFs/bC9pbmRpYW4tcHJh/d24tbWFzYWxhLXdp/dGgtc3BpY2VzLXBo/b3RvLmpwZw",
    rating: 4.6,
    category: "Main Course",
    type: "non-veg",
    isSpecial: false,
  },

  // Biryani Section
  {
    id: "b1",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice cooked with tender chicken and aromatic spices",
    price: 499,
    image:
      "https://imgs.search.brave.com/lhh4o5f4L-B4EqpA_mTfUF4UDBsA_-LSbDK2SEhpEvw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9kdW0taGFuZGkt/Y2hpY2tlbi1iaXJ5/YW5pLWlzLXByZXBh/cmVkLWVhcnRoZW4t/Y2xheS1wb3QtY2Fs/bGVkLWhhYW5kaS1w/b3B1bGFyLWluZGlh/bi1ub24tdmVnZXRh/cmlhbi1mb29kXzQ2/NjY4OS01MjI1NC5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw",
    rating: 4.7,
    category: "Rice",
    type: "biryani",
    isSpecial: true,
  },
  {
    id: "b2",
    name: "Mutton Biryani",
    description:
      "Fragrant basmati rice cooked with tender mutton and aromatic spices",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80",
    rating: 4.8,
    category: "Rice",
    type: "biryani",
    isSpecial: true,
  },
  {
    id: "b3",
    name: "Hyderabadi Biryani",
    description:
      "Authentic Hyderabadi-style biryani with tender meat and aromatic rice",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&q=80",
    rating: 4.9,
    category: "Rice",
    type: "biryani",
    isSpecial: true,
  },
  {
    id: "b4",
    name: "Prawn Biryani",
    description:
      "Fragrant basmati rice cooked with succulent prawns and aromatic spices",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
    rating: 4.6,
    category: "Rice",
    type: "biryani",
    isSpecial: false,
  },
  {
    id: "b5",
    name: "Egg Biryani",
    description:
      "Fragrant basmati rice cooked with boiled eggs and aromatic spices",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
    rating: 4.4,
    category: "Rice",
    type: "biryani",
    isSpecial: false,
  },
  {
    id: "b6",
    name: "Lucknowi Biryani",
    description: "Fragrant basmati rice cooked with meat in the Lucknowi style",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80",
    rating: 4.7,
    category: "Rice",
    type: "biryani",
    isSpecial: false,
  },

  // Bread Section
  {
    id: "br1",
    name: "Garlic Naan",
    description:
      "Soft, fluffy bread topped with garlic and butter, baked in a tandoor",
    price: 99,
    image:
      "https://imgs.search.brave.com/9T2jwTVsOJbFNt0t-8zqxg3hU4P2aU9TZw6MYH0RY8A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aGFsZmJha2VkaGFy/dmVzdC5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMTkvMDIv/SGVyYmVkLUdhcmxp/Yy1CdXR0ZXItTmFh/bi05LTcwMHg0Njcu/anBn",
    rating: 4.7,
    category: "Bread",
    type: "bread",
    isSpecial: false,
  },
  {
    id: "br2",
    name: "Butter Naan",
    description: "Soft, fluffy bread brushed with butter, baked in a tandoor",
    price: 89,
    image:
      "https://imgs.search.brave.com/gwTK_GNgAbVWhsuKSJlSx16ug0LfKemnmwKtUhVSS2c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQ0/MDUyMzE0MS9waG90/by9ob21lbWFkZS1u/YWFuLWJyZWFkcy13/aXRoLWN1cnJ5LWFu/ZC1oZXJicy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9d0xm/c2RKZC1tcTN2bV9s/QUZMVFNvYnpkSktT/SzEteHRuaTlEY0xN/R3Rydz0",
    rating: 4.6,
    category: "Bread",
    type: "bread",
    isSpecial: false,
  },
  {
    id: "br3",
    name: "Plain Roti",
    description: "Whole wheat bread baked in a tandoor",
    price: 49,
    image:
      "https://imgs.search.brave.com/B_6J7J5MbZXyMQOli46X8FyAtWP3tiSspNOMXldbDn0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odW5n/ZXJlbmQuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzAz/L3BsYWluLXJvdGkt/bWluLmpwZw",
    rating: 4.5,
    category: "Bread",
    type: "bread",
    isSpecial: false,
  },
  {
    id: "br4",
    name: "Cheese Naan",
    description: "Soft, fluffy bread stuffed with cheese, baked in a tandoor",
    price: 149,
    image:
      "https://imgs.search.brave.com/QjHMBK30Y23oPqTWsFLbP1B6IPWg7CVoOYc-e3JPKt0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9uYWFuLWZpbGxl/ZC13aXRoLWNoZWVz/ZS1waG90b18xMDM2/OTk4LTI4Nzg2OC5q/cGc_c2VtdD1haXNf/aHlicmlk",
    rating: 4.8,
    category: "Bread",
    type: "bread",
    isSpecial: true,
  },
  {
    id: "br5",
    name: "Laccha Paratha",
    description: "Layered whole wheat bread, baked in a tandoor",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
    rating: 4.6,
    category: "Bread",
    type: "bread",
    isSpecial: false,
  },

  // Starters
  {
    id: "s1",
    name: "Paneer Tikka",
    description:
      "Chunks of cottage cheese marinated in spices and grilled to perfection",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    rating: 4.4,
    category: "Appetizer",
    type: "starter",
    isSpecial: false,
  },
  {
    id: "s2",
    name: "Vegetable Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
    rating: 4.5,
    category: "Appetizer",
    type: "starter",
    isSpecial: false,
  },
  {
    id: "s3",
    name: "Onion Bhaji",
    description: "Crispy onion fritters spiced with Indian herbs",
    price: 129,
    image:
      "https://imgs.search.brave.com/hKq064t37OC810BPI_poB7vzfObUF9c6YX2YwrVeleM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/NTYwMzAxL3Bob3Rv/L29uaW9uLWJoYWpp/YS1mcmllZC1pbmRp/YS1zbmFjay5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9Qmhh/N3hYX1FfUkZPRjBJ/WDR3V2JON1FXdUQ3/dWtsUzZFUVdJcjJP/dy0xOD0",
    rating: 4.3,
    category: "Appetizer",
    type: "starter",
    isSpecial: false,
  },
  {
    id: "s4",
    name: "Chicken Pakora",
    description: "Spiced chicken fritters deep-fried to perfection",
    price: 249,
    image:
      "https://imgs.search.brave.com/fuscFhtsuGERBxNheAbvWbxO-OoMAip7e5Ex4O_aPpE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vo/S1B3NW9VRDNIQVMx/LVhpdkdocW9pRDFp/WmU4Ym05SDdaSU1r/dXBUbE1MNFBzVFZX/ZDJsMXIxN3o3aUFj/bVRrWWJJSWJNOWZn/WklKSml1enp3dHRi/amhXaGcwNDRXT09B/bTBRUEF0RnhIMW1H/emZQbHF1dzhYbFMw/ME9RTWdIWDgyXy0z/Y2N5U1ZmN0UvZC9l/YXN5LWNoaWNrZW4t/cGFrb3JhLmpwZw",
    rating: 4.6,
    category: "Appetizer",
    type: "starter",
    isSpecial: false,
  },
  {
    id: "s5",
    name: "Fish Amritsari",
    description: "Fish fillets marinated in spices and deep-fried",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1626508035297-0cd27c397d67?w=500&q=80",
    rating: 4.7,
    category: "Appetizer",
    type: "starter",
    isSpecial: true,
  },

  // Drinks
  {
    id: "d1",
    name: "Mango Lassi",
    description:
      "Refreshing yogurt drink blended with ripe mangoes and a hint of cardamom",
    price: 149,
    image:
      "https://imgs.search.brave.com/FphJjw_7jaEvUCqR06yMKoski7IPEIOAsphqWP6x5ww/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/ZWxpY2lvdXMtaW5k/aWFuLW1hbmdvLWRy/aW5rXzIzLTIxNDg3/MzQ2NzkuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MA",
    rating: 4.7,
    category: "Beverage",
    type: "drinks",
    isSpecial: true,
  },
  {
    id: "d2",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&q=80",
    rating: 4.6,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },
  {
    id: "d3",
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water, served sweet or salty",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
    rating: 4.4,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },
  {
    id: "d4",
    name: "Watermelon Juice",
    description: "Fresh watermelon juice, perfect for hot summer days",
    price: 129,
    image:
      "https://imgs.search.brave.com/ji47GQFnVdnjkKqiy9nKdvjyZbDMsyMsbNHhAiCoARE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/bG9zZS11cC13YXRl/cm1lbG9uLWp1aWNl/LWdsYXNzLXBsYXRl/XzIzLTIxNDgyOTM4/MzkuanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MA",
    rating: 4.5,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },
  {
    id: "d5",
    name: "Rose Milk",
    description: "Chilled milk flavored with rose syrup",
    price: 129,
    image:
      "https://imgs.search.brave.com/iiYYK-UEhJXhlcT7wWrtoUBN9m0Ku85ni2DdTpI9mCI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9w/aW5rLWNvb2tpZS1t/aWxrLXNoYWtlLXRv/d2VsLW1hcmJsZS1i/YWNrZ3JvdW5kLWhp/Z2gtcXVhbGl0eS1w/aG90b18xMTQ1Nzkt/MzY0OTQuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MA",
    rating: 4.3,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },
  {
    id: "d6",
    name: "Sweet Lassi",
    description: "Traditional yogurt drink sweetened with sugar",
    price: 99,
    image:
      "https://imgs.search.brave.com/NFVS9CQMrLCoIsProych8juGpPRYQPZrKT50hEXQ80w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/ZWxpY2lvdXMtaW5k/aWFuLWRyaW5rcy1h/cnJhbmdlbWVudF8y/My0yMTQ5MzEyMzgy/LmpwZz9zZW10PWFp/c19pdGVtc19ib29z/dGVkJnc9NzQw",
    rating: 4.5,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },
  {
    id: "d7",
    name: "Mango Shake",
    description: "Thick milkshake made with fresh mangoes",
    price: 149,
    image:
      "https://imgs.search.brave.com/imxvyMf3OKibik4ZWVZ1-CGqLsj2JVEepuUGwvU792I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvODIx/MTE3OS9wZXhlbHMt/cGhvdG8tODIxMTE3/OS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA",
    rating: 4.7,
    category: "Beverage",
    type: "drinks",
    isSpecial: false,
  },

  // Desserts
  {
    id: "ds1",
    name: "Gulab Jamun",
    description:
      "Soft milk solids dumplings soaked in rose-flavored sugar syrup",
    price: 149,
    image:
      "https://imgs.search.brave.com/bA0U3RmMRHT2wzdRMryi1AHfEcw-OEYO7BSCpiQJGTI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzQ0/OTEwNS9wZXhlbHMt/cGhvdG8tNzQ0OTEw/NS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA",
    rating: 4.8,
    category: "Dessert",
    type: "dessert",
    isSpecial: true,
  },
  {
    id: "ds2",
    name: "Rasmalai",
    description:
      "Soft cottage cheese patties soaked in sweetened, thickened milk",
    price: 199,
    image:
      "https://imgs.search.brave.com/0e57jFeIrbaBdcqrFp2zTq_2IJ8JON55tAS3q8wKQVk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hbmdvb3JpLXJh/c21hbGFpLWlzLWlu/ZGlhbi1kZXNzZXJ0/LXN3ZWV0LXdpdGgt/ZHJ5LWZydWl0cy1z/YWZmcm9uLXRvcHBp/bmdzLXNlcnZlZC1i/b3dsLW1vb2R5LWJh/Y2tncm91bmQtc2Vs/ZWN0aXZlLWZvY3Vz/XzQ2NjY4OS01ODc4/MC5qcGc_c2VtdD1h/aXNfaHlicmlk",
    rating: 4.7,
    category: "Dessert",
    type: "dessert",
    isSpecial: false,
  },
  {
    id: "ds3",
    name: "Kheer",
    description:
      "Creamy rice pudding flavored with cardamom and topped with nuts",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?w=500&q=80",
    rating: 4.6,
    category: "Dessert",
    type: "dessert",
    isSpecial: false,
  },
  {
    id: "ds4",
    name: "Kulfi",
    description: "Traditional Indian ice cream in various flavors",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&q=80",
    rating: 4.5,
    category: "Dessert",
    type: "dessert",
    isSpecial: false,
  },
  {
    id: "ds5",
    name: "Jalebi",
    description: "Crispy, syrup-soaked sweet pretzel-like dessert",
    price: 129,
    image:
      "https://cdn.pixabay.com/photo/2015/06/23/05/23/fresh-jalebi-818316_1280.jpg",
    rating: 4.6,
    category: "Dessert",
    type: "dessert",
    isSpecial: false,
  },
  {
    id: "ds6",
    name: "Gajar Halwa",
    description: "Sweet carrot pudding garnished with nuts",
    price: 149,
    image:
      "https://img.freepik.com/free-photo/traditional-azerbaijan-indian-turkish-sweet-dessert-halvah-with-nuts-top_114579-1310.jpg?t=st=1752250107~exp=1752253707~hmac=9e699f5965b47807c488c2c87ebcfec11f533a8dc4f87d42dcb8145c564e8016&w=740",
    rating: 4.7,
    category: "Dessert",
    type: "dessert",
    isSpecial: false,
  },
];
