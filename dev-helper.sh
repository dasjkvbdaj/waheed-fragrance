#!/bin/bash
# Script to help with common development tasks

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Luxe Perfumes Development Helper${NC}"
echo "=================================="
echo ""

# Function to display menu
show_menu() {
    echo "What would you like to do?"
    echo "1. Start development server"
    echo "2. Build for production"
    echo "3. Run production server"
    echo "4. Clean build cache"
    echo "5. Install dependencies"
    echo "6. View documentation"
    echo "7. Exit"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-7]: " choice
    
    case $choice in
        1)
            echo -e "${GREEN}Starting development server...${NC}"
            npm run dev
            ;;
        2)
            echo -e "${GREEN}Building for production...${NC}"
            npm run build
            ;;
        3)
            echo -e "${GREEN}Starting production server...${NC}"
            npm start
            ;;
        4)
            echo -e "${YELLOW}Cleaning build cache...${NC}"
            rm -rf .next
            echo -e "${GREEN}Cache cleaned!${NC}"
            ;;
        5)
            echo -e "${GREEN}Installing dependencies...${NC}"
            npm install
            ;;
        6)
            echo -e "${BLUE}Opening documentation...${NC}"
            # Open README in default text editor
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open README.md
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                xdg-open README.md
            else
                echo "Please open README.md in your editor"
            fi
            ;;
        7)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid option. Please try again.${NC}"
            ;;
    esac
    echo ""
done
