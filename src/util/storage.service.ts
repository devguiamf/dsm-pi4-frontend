import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getName(){
    return localStorage.getItem('Name')
  }

  getEmail(){
    return localStorage.getItem('Email')
  }

  getToken(){
    return localStorage.getItem('Token')
  }

  getId(){
    return localStorage.getItem('id')
  }

  getNameProduct(){
    return localStorage.getItem('ProductName')
  }

  getIdProduct(){
    return localStorage.getItem('ProductId')
  }

  setName(name: string){
    return localStorage.setItem('Name', name)
  }

  setEmail(email: string){
    return localStorage.setItem('Email', email)
  }

  setToken(token: string){
    return localStorage.setItem('Token', token)
  }

  setId(id: string){
    return localStorage.setItem('id', id)
  }

  setNameProduct(product: string){
    return localStorage.setItem('ProductName', product)
  }

  setIdProduct(UUID: string){
    return localStorage.setItem('ProductId', UUID)
  }

  deleteUserInfos(){
    localStorage.clear()
  }
}
