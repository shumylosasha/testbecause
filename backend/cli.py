import asyncio
import argparse
from manager import ProcurementManager
from printer import Printer
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Verify OpenAI API key is set
if not os.getenv('OPENAI_API_KEY'):
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please create a .env file with your OpenAI API key.")

async def search_product(manager, query):
    print("\n=== Search Product ===")
    print(f"Searching for: {query}")
    
    print("\nPlanning search strategy...")
    websites = await manager.plan(query)
    
    print("\nPlanned websites:")
    for website in websites:
        print(f"- {website}")
    
    print("\nSearching for products...")
    results = await manager.run(query, websites)
    
    print("\nSearch Results:")
    print(f"Summary: {results['summary']}")
    print(f"Total Products: {results['total_products']}")
    print(f"Price Range: {results['price_range']}")
    
    print("\nProducts:")
    for product in results['products']:
        print(f"\nProduct: {product['name']}")
        print(f"Price: {product['price']}")
        print(f"Website: {product['website']}")
        print(f"URL: {product['url']}")
        if product.get('images'):
            print("Images:")
            for img in product['images']:
                print(f"- {img['url']}")

async def get_market_intelligence(manager, product_name, category=None, manufacturer=None, price=None, vendor=None):
    print("\n=== Market Intelligence ===")
    print(f"Analyzing: {product_name}")
    
    query = f"""
    Analyze market intelligence for {product_name} in category {category}.
    Current manufacturer: {manufacturer}
    Current price: {price}
    Current vendor: {vendor}
    """
    
    result = await manager.get_market_intelligence(query)
    
    print("\nMarket Intelligence Report:")
    print(f"Product Category: {result['product_category']}")
    print(f"Last Updated: {result['last_updated']}")
    
    print("\nMarket Trends:")
    for trend in result['trends']:
        print(f"\n{trend['title']}")
        print(f"Description: {trend['description']}")
        print(f"Confidence: {trend['confidence']:.2%}")
    
    print(f"\nSupply Chain Status:\n{result['supply_chain_status']}")
    print(f"\nPrice Forecast:\n{result['price_forecast']}")
    
    print("\nKey Manufacturers:")
    for manufacturer in result['key_manufacturers']:
        print(f"- {manufacturer}")

async def search_images(manager, product_name, website_url):
    print("\n=== Search Product Images ===")
    print(f"Searching for images of {product_name} on {website_url}")
    
    result = await manager.find_product_images(product_name, website_url)
    
    print(f"\nImages for {product_name} on {website_url}:")
    if result['images']:
        for img in result['images']:
            print(f"- {img['url']}")
    else:
        print("No images found")

async def check_compliance(manager, file_path, products):
    print("\n=== Check Compliance ===")
    print(f"Checking compliance for products: {', '.join(products)}")
    
    print("\nUploading compliance document...")
    file_id = await manager.upload_compliance_doc(file_path, 0)
    print(f"Compliance document uploaded with ID: {file_id}")
    
    print("\nChecking compliance...")
    products_list = [{'name': p.strip()} for p in products]
    results = await manager.check_compliance_for_products(products_list)
    
    print("\nCompliance Results:")
    for result in results:
        print(f"\nProduct: {result.product_name}")
        print(f"Compliant: {'Yes' if result.compliant else 'No'}")
        print(f"Explanation: {result.explanation}")

async def main():
    parser = argparse.ArgumentParser(description='Healthcare Procurement CLI')
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Search product command
    search_parser = subparsers.add_parser('search', help='Search for a product')
    search_parser.add_argument('query', help='Product to search for')
    
    # Market intelligence command
    intel_parser = subparsers.add_parser('intel', help='Get market intelligence')
    intel_parser.add_argument('product_name', help='Product name')
    intel_parser.add_argument('--category', help='Product category')
    intel_parser.add_argument('--manufacturer', help='Manufacturer')
    intel_parser.add_argument('--price', help='Current price')
    intel_parser.add_argument('--vendor', help='Vendor')
    
    # Search images command
    images_parser = subparsers.add_parser('images', help='Search for product images')
    images_parser.add_argument('product_name', help='Product name')
    images_parser.add_argument('website_url', help='Website URL')
    
    # Check compliance command
    compliance_parser = subparsers.add_parser('compliance', help='Check compliance')
    compliance_parser.add_argument('file_path', help='Path to compliance document')
    compliance_parser.add_argument('products', help='Comma-separated list of products to check')
    
    args = parser.parse_args()
    
    printer = Printer()
    manager = ProcurementManager(printer)
    
    try:
        if args.command == 'search':
            await search_product(manager, args.query)
        elif args.command == 'intel':
            await get_market_intelligence(
                manager, 
                args.product_name,
                args.category,
                args.manufacturer,
                args.price,
                args.vendor
            )
        elif args.command == 'images':
            await search_images(manager, args.product_name, args.website_url)
        elif args.command == 'compliance':
            await check_compliance(manager, args.file_path, args.products.split(','))
        else:
            parser.print_help()
    finally:
        printer.end()

if __name__ == '__main__':
    asyncio.run(main()) 