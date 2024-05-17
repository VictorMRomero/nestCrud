
export interface PokeResponse {
    
    count:  number;
    next:   string;
    previus:    null;
    results: Result[];
    
}

export interface Result {
    name:   string;
    url:    string
}