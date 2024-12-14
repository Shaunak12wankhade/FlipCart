import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'flipcart';

  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchQuery: string = '';
  newProduct: Partial<Product> = { rating: { rate: 0, count: 0 }, };

  editMode: boolean = false;   // is used to change the title add/edit based on the actions

  selectedProductId: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe((response) => {

      this.products = response;
      console.log("this.products:-", this.products);
      console.log("this.products.length:-", this.products.length);
      
      this.filteredProducts = [...this.products];
      console.log("this.filteredProducts:-", this.filteredProducts);

    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
  addProduct(): void {
    const addProduct = {
      id: this.products.length + 1,
      title: this.newProduct.title || '',
      price: this.newProduct.price || 0,
      description: this.newProduct.description || '',
      category: this.newProduct.category || '',
      image: this.newProduct.image || '',
      rating: {
        rate: this.newProduct.rating?.rate || 0,
        count: this.newProduct.rating?.count || 0
      }
    };
    this.products.push(addProduct);       // to ADD new product to database
    this.filteredProducts = [...this.products];     // ... is spread operator that overrides the existing products array , // filteredproducts [] is used to store/dislay the final products values after add,update & delete
    console.log("this.filteredProducts for add:-", this.filteredProducts);
    
    this.newProduct = { rating: { rate: 0, count: 0 } };     // to UPDATE product as per below editProduct()
    console.log("this.newProduct to update:-", this.newProduct);

  }


  editProduct(product: Product): void {
    this.editMode = true;
    this.selectedProductId = product.id;   //taken from interface product 
    this.newProduct = { ...product };      //... is spread operator that overrides the existing product object 

    console.log("this.newProduct for update:-", this.newProduct);

  }


  updateProduct(): void {
    if (this.selectedProductId !== null) {
      
      const index = this.products.findIndex((p) => p.id === this.selectedProductId);
      
      this.products[index] = {
        id: this.selectedProductId,
        title: this.newProduct.title || '',
        price: this.newProduct.price || 0,
        description: this.newProduct.description || '',
        category: this.newProduct.category || '',
        image: this.newProduct.image || '',
        rating: {
          rate: this.newProduct.rating?.rate || this.products[index].rating.rate,
          count: this.newProduct.rating?.count || this.products[index].rating.count
        }
      } as Product;
      this.filteredProducts = [...this.products];  // filteredproducts [] is used to store/dislay the final products values after add,update or delete
      this.editMode = false;         // is now set to false after completion of updation
      this.selectedProductId = null;
      this.newProduct = { rating: { rate: 0, count: 0 } };
    }
  }


  deleteProduct(productId: number): void {
    this.products = this.products.filter((product) => product.id !== productId);
    this.filteredProducts = [...this.products];     // filteredproducts [] is used to store/dislay the final products values after add,update & delete

  }
}
