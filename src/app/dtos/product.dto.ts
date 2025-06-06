export interface ProductDTO {
    [id: string]: string; // Funciona únicamente si todos los campos son STRING
    name: string;
    description: string;
    logo: string;
    date_release: string; 
    date_revision: string; 

}