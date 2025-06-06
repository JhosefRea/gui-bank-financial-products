//La función extractColumnKeys extrae dinámicamente las keys de los objetos del array, 
// y se excluye la key 'id' porque se necesita generar automáticamente columnas en una tabla 
// sin mostrar este campo y así no QUEMAR en el código 

export function extractColumnKeys(data: any[], excludeKey: string = 'id'): string[] {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(i => i !== excludeKey);
}
  