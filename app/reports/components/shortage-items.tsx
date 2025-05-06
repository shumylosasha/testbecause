"use client";

import React, { useState } from 'react';
import { Search, Info, Filter, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Supplier {
  name: string;
  availability: number;
  reorderLink: string;
}

interface SupplyItem {
  id: number;
  name: string;
  categoryId: number;
  shortagePercent?: number;  // Made optional since we might have surplus instead
  surplusPercent?: number;   // Added for items with surplus
  usageVolume: number;       // Added to represent how much the item is used (0-100)
  x: number;
  y: number;
  z: number;
  suppliers: Supplier[];
  details: string;
  imageUrl?: string;         // Added for product images
}

interface Connection {
  from: number;
  to: number;
  type: 'related' | 'dependent';
}

const ShortageItems = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showDataSources, setShowDataSources] = useState(false);
  
  // Data sources
  const dataSources = [
    { name: 'FDA Medical Device Shortages List', year: 2025, url: 'https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/medical-device-shortages-during-covid-19-public-health-emergency' },
    { name: 'USP Medicine Supply Map', year: 2025, url: 'https://www.usp.org/supply-chain/medicine-supply-map' },
    { name: 'HRSA Health Professional Shortage Areas', year: 2025, url: 'https://data.hrsa.gov/topics/health-workforce/shortage-areas' }
  ];

  // Define supply categories
  const categories: Category[] = [
    { id: 1, name: 'Medical Devices', color: '#E57373' },
    { id: 2, name: 'Pharmaceuticals', color: '#64B5F6' },
    { id: 3, name: 'Personal Protective Equipment', color: '#81C784' },
    { id: 4, name: 'Laboratory Supplies', color: '#FFD54F' },
    { id: 5, name: 'Surgical Supplies', color: '#BA68C8' }
  ];

  // Define connections between items
  const connections: Connection[] = [
    { from: 101, to: 102, type: 'related' }, // Infusion Pumps to Drug Delivery Devices
    { from: 102, to: 201, type: 'dependent' }, // Drug Delivery to Sterile Injectables
    { from: 301, to: 501, type: 'related' }, // N95 Masks to Surgical Instruments
    { from: 401, to: 301, type: 'dependent' }, // Test Kits to N95 Masks
    // Add more connections as needed to match your visualization
  ];
  
  // Updated supply items with usage volume and surplus/shortage information
  const supplyItems: SupplyItem[] = [
    { 
      id: 101, 
      name: 'Surgical Gloves', 
      categoryId: 1, 
      shortagePercent: 45, 
      usageVolume: 95,  // Highest usage
      x: 150, 
      y: 120, 
      z: 50,
      imageUrl: '/images/surgical-gloves.png',
      suppliers: [
        { name: 'MedSupply Co', availability: 55, reorderLink: '/orders/new?item=surgical-gloves&supplier=medsupply' },
        { name: 'HealthTech Solutions', availability: 45, reorderLink: '/orders/new?item=surgical-gloves&supplier=healthtech' }
      ],
      details: "Critical shortage of most used item"
    },
    { 
      id: 102, 
      name: 'Face Masks', 
      categoryId: 3, 
      surplusPercent: 35,  // Surplus item
      usageVolume: 85,
      x: 250, 
      y: 150, 
      z: 30,
      imageUrl: '/images/face-masks.png',
      suppliers: [
        { name: 'Global Medical Distributors', availability: 100, reorderLink: '/orders/new?item=face-masks&supplier=global' }
      ],
      details: "High usage item with surplus stock"
    },
    { 
      id: 201, 
      name: 'Sterile Injectables', 
      categoryId: 2, 
      shortagePercent: 76, 
      usageVolume: 70,
      x: 350, 
      y: 120, 
      z: 70,
      imageUrl: '/images/injectables.png',
      suppliers: [
        { name: 'Regional Medical Supply', availability: 24, reorderLink: '/orders/new?item=sterile-injectables&supplier=regional' },
        { name: 'MedSupply Co', availability: 18, reorderLink: '/orders/new?item=sterile-injectables&supplier=medsupply' }
      ],
      details: "Severe shortage of critical medication"
    },
    { 
      id: 301, 
      name: 'N95 Masks', 
      categoryId: 3, 
      surplusPercent: 15,
      usageVolume: 60,
      x: 150, 
      y: 360, 
      z: 30,
      imageUrl: '/images/n95-masks.png',
      suppliers: [
        { name: 'HealthTech Solutions', availability: 92, reorderLink: '/orders/new?item=n95-masks&supplier=healthtech' }
      ],
      details: "Moderate surplus maintained"
    },
    { 
      id: 401, 
      name: 'Test Kits', 
      categoryId: 4, 
      shortagePercent: 42, 
      usageVolume: 55,
      x: 480, 
      y: 350, 
      z: 40,
      imageUrl: '/images/test-kits.png',
      suppliers: [
        { name: 'Global Medical Distributors', availability: 58, reorderLink: '/orders/new?item=test-kits&supplier=global' }
      ],
      details: "Moderate shortage affecting diagnostics"
    },
    { 
      id: 501, 
      name: 'Surgical Instruments', 
      categoryId: 5, 
      shortagePercent: 39, 
      usageVolume: 75,
      x: 350, 
      y: 220, 
      z: 40,
      imageUrl: '/images/surgical-instruments.png',
      suppliers: [
        { name: 'MedSupply Co', availability: 61, reorderLink: '/orders/new?item=surgical-instruments&supplier=medsupply' }
      ],
      details: "High usage items with ongoing shortage"
    }
  ];
  
  // Helper function to determine shortage severity
  const getSeverityLevel = (item: SupplyItem): 'high' | 'medium' | 'low' => {
    if (item.shortagePercent && item.shortagePercent >= 60) return 'high';
    if (item.shortagePercent && item.shortagePercent >= 30) return 'medium';
    return 'low';
  };

  // Updated filter function
  const filteredItems = supplyItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || 
      item.categoryId === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || 
      getSeverityLevel(item) === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  // Filter connections based on filtered items
  const filteredConnections = connections.filter(conn => {
    const fromItem = filteredItems.find(item => item.id === conn.from);
    const toItem = filteredItems.find(item => item.id === conn.to);
    return fromItem && toItem;
  });
  
  const getCategoryColor = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#ccc';
  };
  
  const getShortageColor = (percent: number): string => {
    if (percent >= 60) return '#FF5252'; // High shortage - red
    if (percent >= 30) return '#FFC107'; // Medium shortage - yellow
    return '#4CAF50'; // Low shortage - green
  };
  
  const getShortageSize = (item: SupplyItem): number => {
    const baseSize = 25;
    const usageMultiplier = item.usageVolume / 100;
    return baseSize + (usageMultiplier * 45);
  };
  
  const getIndicatorStyle = (item: SupplyItem): React.CSSProperties => {
    const size = getShortageSize(item);
    const isHovered = hoveredItem === item.id;
    const value = item.surplusPercent ? `+${item.surplusPercent}%` : item.shortagePercent ? `-${item.shortagePercent}%` : '';
    const color = item.surplusPercent ? '#4CAF50' : getShortageColor(item.shortagePercent || 0);
    
    return {
      position: 'absolute',
      left: `${item.x + size/2}px`,
      top: `${item.y - size/2}px`,
      backgroundColor: color,
      color: 'white',
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 'bold',
      transform: 'translateX(-50%)',
      opacity: isHovered ? 1 : 0.8,
      transition: 'all 0.3s ease',
      zIndex: 20
    };
  };
  
  const getBubbleStyle = (item: SupplyItem): React.CSSProperties => {
    const size = getShortageSize(item);
    const isHovered = hoveredItem === item.id;
    
    return {
      position: 'absolute',
      left: `${item.x - size/2}px`,
      top: `${item.y - size/2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: getCategoryColor(item.categoryId),
      border: `3px solid ${item.surplusPercent ? '#4CAF50' : getShortageColor(item.shortagePercent || 0)}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: isHovered ? 1000 : 10,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
      overflow: 'hidden'
    };
  };
  
  const getLabelStyle = (item: SupplyItem): React.CSSProperties => {
    const size = getShortageSize(item);
    const isHovered = hoveredItem === item.id;
    
    return {
      position: 'absolute',
      left: `${item.x}px`,
      top: `${item.y + size/2 + 5}px`,
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px',
      marginLeft: '-60px',
      color: '#333',
      textShadow: '0px 0px 4px white',
      display: isHovered ? 'block' : 'none'
    };
  };
  
  const getDetailStyle = (item: SupplyItem): React.CSSProperties => {
    const size = getShortageSize(item);
    const isHovered = hoveredItem === item.id;
    
    return {
      position: 'absolute',
      left: `${item.x}px`,
      top: `${item.y + size/2 + 20}px`,
      fontSize: '8px',
      color: getShortageColor(item.shortagePercent || 0),
      textAlign: 'center',
      width: '120px',
      marginLeft: '-60px',
      fontWeight: 'bold',
      textShadow: '0px 0px 3px white',
      display: isHovered ? 'block' : 'none'
    };
  };

  // Enhanced connection drawing with tooltips
  const drawConnection = (conn: Connection) => {
    const fromItem = supplyItems.find(item => item.id === conn.from);
    const toItem = supplyItems.find(item => item.id === conn.to);
    
    if (!fromItem || !toItem) return null;

    const relationshipType = conn.type === 'related' ? 'Related Items' : 'Supply Chain Dependency';
    
    return (
      <g key={`${conn.from}-${conn.to}`}>
        <line 
          x1={fromItem.x} 
          y1={fromItem.y} 
          x2={toItem.x} 
          y2={toItem.y} 
          stroke="#666"
          strokeWidth={1}
          strokeDasharray={conn.type === 'dependent' ? "5,5" : ""}
          opacity={0.5}
        />
        <title>{relationshipType}</title>
      </g>
    );
  };
  
  const renderItemDetails = (item: SupplyItem) => {
    if (hoveredItem !== item.id) return null;
    
    return (
      <Card className="absolute right-3 top-3 w-80 z-50">
        <CardHeader>
          <CardTitle className="text-lg" style={{color: getCategoryColor(item.categoryId)}}>
            {item.name}
          </CardTitle>
          <CardDescription>{item.details}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Shortage Level:</span>
              <Badge 
                variant={item.shortagePercent && item.shortagePercent >= 60 ? "destructive" : item.shortagePercent && item.shortagePercent >= 30 ? "secondary" : "default"}
              >
                {item.shortagePercent ? item.shortagePercent + "%" : "N/A"}
              </Badge>
            </div>
            
            <h4 className="text-sm font-bold mb-2">Available Suppliers:</h4>
            <ul className="space-y-2">
              {item.suppliers.map((supplier: Supplier, idx: number) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{supplier.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${supplier.availability < 50 ? 'text-red-500' : 'text-green-500'}`}>
                      {supplier.availability}% available
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = supplier.reorderLink}
                    >
                      Order
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Products Map</h2>
          <p className="text-sm text-gray-600">Visual representation of product availability and demand</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDataSources(!showDataSources)}
        >
          <Database className="h-4 w-4 mr-2" />
          Data Sources
        </Button>
      </div>

      {showDataSources && (
        <Card className="mb-4 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-sm">Data Sources</CardTitle>
            <CardDescription>Current data is sourced from:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {dataSources.map((source, index) => (
                <li key={index}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {source.name}
                  </a>
                  <span className="text-gray-500 text-xs ml-2">({source.year})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              style={{borderLeft: `4px solid ${category.color}`}}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search supplies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => setSelectedSeverity('all')}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-full px-4 text-sm"
          >
            <Filter className="w-3 h-3 mr-1.5" />
            All Levels
          </Button>
          <Button 
            variant={selectedSeverity === 'high' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity('high')}
            className="border-red-500 text-sm"
          >
            High Shortage
          </Button>
          <Button 
            variant={selectedSeverity === 'medium' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity('medium')}
            className="border-yellow-500 text-sm"
          >
            Medium Shortage
          </Button>
          <Button 
            variant={selectedSeverity === 'low' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity('low')}
            className="border-green-500 text-sm"
          >
            Low/No Shortage
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Stock Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2" style={{borderColor: '#FF5252'}}></div>
            <span className="text-xs">Shortage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2" style={{borderColor: '#4CAF50'}}></div>
            <span className="text-xs">Surplus</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Bubble Size:</span>
          <span className="text-xs">Represents usage volume</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Lines:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0 border-t-2 border-gray-400"></div>
            <span className="text-xs">Related Items</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0 border-t-2 border-gray-400 border-dashed"></div>
            <span className="text-xs">Supply Chain Dependency</span>
          </div>
        </div>
      </div>
      
      <div className="relative border rounded-lg bg-gradient-to-b from-blue-50 to-slate-100" style={{height: '450px', overflow: 'hidden'}}>
        {hoveredItem === null && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-70 p-2 rounded-md shadow-sm z-40 text-xs">
            <div className="font-bold mb-1">Hover over items to:</div>
            <div>• View stock levels</div>
            <div>• See usage volume</div>
            <div>• Check available suppliers</div>
          </div>
        )}
        
        <svg width="100%" height="100%">
          {filteredConnections.map(conn => drawConnection(conn))}
        </svg>
        
        {filteredItems.map(item => (
          <div key={item.id}>
            <div 
              style={getBubbleStyle(item)} 
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-1/2 h-1/2 object-contain opacity-50"
                />
              )}
            </div>
            <div style={getLabelStyle(item)}>{item.name}</div>
            <div style={getIndicatorStyle(item)}>
              {item.surplusPercent ? `+${item.surplusPercent}%` : item.shortagePercent ? `-${item.shortagePercent}%` : ''}
            </div>
            {renderItemDetails(item)}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Info className="w-4 h-4" />
        <span>Hover over items to view details and place orders with available suppliers</span>
      </div>
    </Card>
  );
};

export default ShortageItems; 