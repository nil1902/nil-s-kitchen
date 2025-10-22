import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Save,
  X,
  Upload
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  isVeg: boolean;
  preparationTime: string;
  ingredients: string[];
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
    isVeg: true,
    preparationTime: "",
    ingredients: ""
  });

  useEffect(() => {
    loadMenuData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchTerm, selectedCategory]);

  const loadMenuData = async () => {
    try {
      // Load from your existing MenuData.ts or create dynamic menu
      const { menuData } = await import("@/components/menu/MenuData");
      
      // Convert static menu to dynamic format
      const dynamicMenu: MenuItem[] = [];
      const categorySet = new Set<string>();

      Object.entries(menuData).forEach(([category, items]) => {
        categorySet.add(category);
        items.forEach((item, index) => {
          dynamicMenu.push({
            id: `${category}-${index}`,
            name: item.name,
            description: item.description,
            price: item.price,
            category: category,
            image: item.image,
            available: true,
            isVeg: item.isVeg || false,
            preparationTime: "15-20 min",
            ingredients: item.ingredients || []
          });
        });
      });

      setMenuItems(dynamicMenu);
      setCategories(Array.from(categorySet));
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleAddItem = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: categories[0] || "",
      image: "",
      available: true,
      isVeg: true,
      preparationTime: "15-20 min",
      ingredients: ""
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
      isVeg: item.isVeg,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients.join(", ")
    });
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleSaveItem = () => {
    const newItem: MenuItem = {
      id: editingItem?.id || `new-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      available: formData.available,
      isVeg: formData.isVeg,
      preparationTime: formData.preparationTime,
      ingredients: formData.ingredients.split(",").map(i => i.trim()).filter(i => i)
    };

    if (editingItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setMenuItems(prev => [...prev, newItem]);
      if (!categories.includes(newItem.category)) {
        setCategories(prev => [...prev, newItem.category]);
      }
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const bulkUpdatePrices = (percentage: number) => {
    if (confirm(`Are you sure you want to ${percentage > 0 ? 'increase' : 'decrease'} all prices by ${Math.abs(percentage)}%?`)) {
      setMenuItems(prev => prev.map(item => ({
        ...item,
        price: Math.round(item.price * (1 + percentage / 100) * 100) / 100
      })));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Menu Management</h1>
            <p className="text-gray-600">Manage your restaurant menu items</p>
          </div>
          <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => bulkUpdatePrices(10)}
              title="Increase all prices by 10%"
            >
              +10%
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => bulkUpdatePrices(-10)}
              title="Decrease all prices by 10%"
            >
              -10%
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {menuItems.filter(item => item.available).length}
              </div>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {menuItems.filter(item => !item.available).length}
              </div>
              <p className="text-sm text-gray-600">Unavailable</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-sm text-gray-600">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`${!item.available ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={item.isVeg ? "default" : "destructive"}>
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                    }}
                  />
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <span className="text-sm text-gray-500">{item.preparationTime}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Category: {item.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preparation Time</label>
                  <Input
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                    placeholder="15-20 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ingredients (comma separated)</label>
                <Input
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="ingredient1, ingredient2, ingredient3"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVeg: e.target.checked }))}
                    className="mr-2"
                  />
                  Vegetarian
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="mr-2"
                  />
                  Available
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveItem} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MenuManagement;