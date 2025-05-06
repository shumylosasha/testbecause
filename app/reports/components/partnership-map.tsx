import React, { useState } from 'react';
import { Search, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PartnershipMap = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [zoom, setZoom] = useState(1);
  
  // Define entity categories
  const categories = [
    { id: 1, name: 'Primary Partners', color: '#4285F4' },
    { id: 2, name: 'Regional Partners', color: '#34A853' },
    { id: 3, name: 'Supply Distributors', color: '#FBBC05' },
    { id: 4, name: 'New Partners', color: '#EA4335' }
  ];
  
  // Define entities with coordinates and relationship strength
  const entities = [
    // Primary Partners
    { 
      id: 101, 
      name: 'MedSupply Co', 
      categoryId: 1, 
      relationshipStrength: 100, 
      x: 400, 
      y: 220,
      tradedItems: [
        { name: 'Surgical Instruments', shortage: 39, reorderLink: '/orders/new?item=surgical-instruments' },
        { name: 'Medical Imaging Devices', shortage: 25, reorderLink: '/orders/new?item=imaging-devices' },
        { name: 'Medications', shortage: 15, reorderLink: '/orders/new?item=medications' }
      ],
      details: "Primary medical supply partner since 2018"
    },
    { 
      id: 102, 
      name: 'HealthTech Solutions', 
      categoryId: 1, 
      relationshipStrength: 90, 
      x: 300, 
      y: 320,
      tradedItems: [
        { name: 'Emergency Supplies', shortage: 45, reorderLink: '/orders/new?item=emergency-supplies' },
        { name: 'Respiratory Equipment', shortage: 30, reorderLink: '/orders/new?item=respiratory-equipment' },
        { name: 'PPE', shortage: 20, reorderLink: '/orders/new?item=ppe' }
      ],
      details: "Technology-focused medical equipment provider"
    },
    
    // Regional Partners
    { 
      id: 201, 
      name: 'Regional Medical Supply', 
      categoryId: 2, 
      relationshipStrength: 75, 
      x: 500, 
      y: 320,
      tradedItems: [
        { name: 'Cardiac Devices', shortage: 35, reorderLink: '/orders/new?item=cardiac-devices' },
        { name: 'Lab Testing Supplies', shortage: 40, reorderLink: '/orders/new?item=lab-supplies' },
        { name: 'Surgical Equipment', shortage: 25, reorderLink: '/orders/new?item=surgical-equipment' }
      ],
      details: "Regional supplier with next-day delivery"
    },
    
    // Supply Distributors
    { 
      id: 301, 
      name: 'Global Medical Distributors', 
      categoryId: 3, 
      relationshipStrength: 85, 
      x: 600, 
      y: 220,
      tradedItems: [
        { name: 'Joint Replacements', shortage: 42, reorderLink: '/orders/new?item=joint-replacements' },
        { name: 'Orthopedic Tools', shortage: 38, reorderLink: '/orders/new?item=orthopedic-tools' },
        { name: 'Rehabilitation Equipment', shortage: 20, reorderLink: '/orders/new?item=rehab-equipment' }
      ],
      details: "International medical equipment distributor"
    }
  ];

  // Define connections between entities
  const connections = [
    { from: 101, to: 102, type: 'primary', strength: 90 },
    { from: 101, to: 201, type: 'regional', strength: 75 },
    { from: 101, to: 301, type: 'distributor', strength: 85 },
    { from: 102, to: 201, type: 'regional', strength: 70 },
    { from: 102, to: 301, type: 'distributor', strength: 80 }
  ];
  
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchTerm === '' || 
      entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || 
      entity.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const filteredConnections = connections.filter(conn => {
    const fromEntity = filteredEntities.find(entity => entity.id === conn.from);
    const toEntity = filteredEntities.find(entity => entity.id === conn.to);
    
    if (highlightedConnections.length > 0) {
      return highlightedConnections.some(id => id === conn.from || id === conn.to) &&
        fromEntity && toEntity;
    }
    
    return fromEntity && toEntity;
  });
  
  const handleEntityClick = (entityId) => {
    if (selectedEntity === entityId) {
      setSelectedEntity(null);
      setHighlightedConnections([]);
    } else {
      setSelectedEntity(entityId);
      
      const connectedEntities = connections
        .filter(conn => conn.from === entityId || conn.to === entityId)
        .map(conn => conn.from === entityId ? conn.to : conn.from);
      
      setHighlightedConnections([entityId, ...connectedEntities]);
    }
  };
  
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#ccc';
  };
  
  const getConnectionType = (type) => {
    switch (type) {
      case 'primary': return { color: '#4285F4', width: 3, dash: '' };
      case 'regional': return { color: '#34A853', width: 2, dash: '' };
      case 'distributor': return { color: '#FBBC05', width: 2, dash: '5,5' };
      default: return { color: '#ccc', width: 1, dash: '' };
    }
  };
  
  const getEntitySize = (relationshipStrength) => {
    return 20 + (relationshipStrength / 100) * 30;
  };
  
  const getBubbleStyle = (entity) => {
    const size = getEntitySize(entity.relationshipStrength);
    const isHighlighted = highlightedConnections.includes(entity.id);
    const isSelected = selectedEntity === entity.id;
    
    return {
      position: 'absolute',
      left: `${entity.x * zoom - size/2}px`,
      top: `${entity.y * zoom - size/2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: getCategoryColor(entity.categoryId),
      border: '3px solid white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: isSelected ? 1000 : isHighlighted ? 100 : 10,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      opacity: highlightedConnections.length > 0 
        ? (isHighlighted ? 1 : 0.3) 
        : 1,
      transition: 'all 0.3s ease',
      transform: isSelected ? 'scale(1.1)' : 'scale(1)'
    };
  };
  
  const getLabelStyle = (entity) => {
    const size = getEntitySize(entity.relationshipStrength);
    const isHighlighted = highlightedConnections.includes(entity.id);
    
    return {
      position: 'absolute',
      left: `${entity.x * zoom}px`,
      top: `${entity.y * zoom + size/2 + 5}px`,
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px',
      marginLeft: '-60px',
      color: '#333',
      textShadow: '0px 0px 4px white',
      opacity: highlightedConnections.length > 0 
        ? (isHighlighted ? 1 : 0.3) 
        : 1,
      transition: 'opacity 0.3s ease'
    };
  };
  
  const drawConnection = (conn) => {
    const fromEntity = entities.find(entity => entity.id === conn.from);
    const toEntity = entities.find(entity => entity.id === conn.to);
    
    if (!fromEntity || !toEntity) return null;
    
    const isHighlighted = highlightedConnections.includes(conn.from) && 
                           highlightedConnections.includes(conn.to);
    
    const connStyle = getConnectionType(conn.type);
    
    const lineWidth = isHighlighted 
      ? connStyle.width * 2
      : connStyle.width;
    
    const opacity = isHighlighted
      ? 1.0
      : highlightedConnections.length > 0 ? 0.2 : 0.7;
    
    return (
      <line 
        key={`${conn.from}-${conn.to}`}
        x1={fromEntity.x * zoom} 
        y1={fromEntity.y * zoom} 
        x2={toEntity.x * zoom} 
        y2={toEntity.y * zoom} 
        stroke={connStyle.color} 
        strokeWidth={lineWidth} 
        strokeDasharray={connStyle.dash}
        opacity={opacity}
      />
    );
  };
  
  const renderEntityDetails = () => {
    if (!selectedEntity) return null;
    
    const entity = entities.find(e => e.id === selectedEntity);
    if (!entity) return null;
    
    const connections = filteredConnections.filter(
      conn => conn.from === entity.id || conn.to === entity.id
    );
    
    const connectedEntities = connections.map(conn => {
      const connectedId = conn.from === entity.id ? conn.to : conn.from;
      const connectedEntity = entities.find(e => e.id === connectedId);
      return {
        entity: connectedEntity,
        connectionType: conn.type,
        strength: conn.strength
      };
    });
    
    return (
      <Card className="absolute right-3 top-3 w-80 z-50">
        <CardHeader>
          <CardTitle className="text-lg" style={{color: getCategoryColor(entity.categoryId)}}>
            {entity.name}
          </CardTitle>
          <CardDescription>{entity.details}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="text-sm font-bold mb-2">Top Traded Items:</h4>
            <ul className="space-y-2">
              {entity.tradedItems.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${item.shortage >= 30 ? 'text-red-500' : 'text-green-500'}`}>
                      {item.shortage}% shortage
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = item.reorderLink}
                    >
                      Reorder
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-bold mb-2">Key Relationships:</h4>
            <ul className="space-y-1">
              {connectedEntities.map(conn => (
                <li key={conn.entity.id} className="flex justify-between text-sm">
                  <span>{conn.entity.name}</span>
                  <span className="font-bold" style={{color: getConnectionType(conn.connectionType).color}}>
                    {conn.strength}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedEntity(null);
              setHighlightedConnections([]);
            }}
          >
            Close
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Partnership Network Map</h2>
          <p className="text-sm text-gray-600">Visual representation of trading partners and supply relationships</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.6))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
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
            placeholder="Search partners..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Connection Types:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-blue-500"></div>
            <span className="text-xs">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-green-600"></div>
            <span className="text-xs">Regional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1.5 bg-yellow-500 border-t border-dashed border-yellow-500"></div>
            <span className="text-xs">Distributor</span>
          </div>
        </div>
      </div>
      
      <div className="relative border rounded-lg bg-gradient-to-b from-blue-50 to-slate-100" style={{height: '450px', overflow: 'hidden'}}>
        {selectedEntity === null && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-70 p-2 rounded-md shadow-sm z-40 text-xs">
            <div className="font-bold mb-1">Click on any partner to:</div>
            <div>• View supply relationships</div>
            <div>• See trading details</div>
            <div>• Place reorders</div>
          </div>
        )}
        
        <svg width="100%" height="100%">
          {filteredConnections.map(conn => drawConnection(conn))}
        </svg>
        
        {filteredEntities.map(entity => (
          <div key={entity.id}>
            <div 
              style={getBubbleStyle(entity)} 
              onClick={() => handleEntityClick(entity.id)}
            ></div>
            <div style={getLabelStyle(entity)}>{entity.name}</div>
          </div>
        ))}
        
        {renderEntityDetails()}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Info className="w-4 h-4" />
        <span>Click partners to explore relationships and place reorders for shortage items</span>
      </div>
    </Card>
  );
};

export default PartnershipMap; 