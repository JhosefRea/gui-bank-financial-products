export interface ProductDTO {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string; // Puede ser Date si deseas convertirlo
    date_revision: string; // Igual, si lo quieres como Date
}