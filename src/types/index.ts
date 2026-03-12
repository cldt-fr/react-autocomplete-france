export interface AutocompleteQueryParams {
    q?: string;
    autocomplete?: '1' | '0';
    index?: string;
    limit?: number;
    lat?: number;
    lon?: number;
    returntruegeometry?: boolean;
    postcode?: string;
    citycode?: string;
    type?: 'housenumber' | 'street' | 'locality' | 'municipality';
    city?: string;
    category?: string;
    departmentcode?: string;
    municipalitycode?: string;
    oldmunicipalitycode?: string;
    districtcode?: string;
    section?: string;
    number?: string;
    sheet?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface AutocompleteResponse {
    type: string
    features: AutocompleteFeature[]
}

export interface AutocompleteFeature {
    type: string
    geometry: AutocompleteGeometry
    properties: AutocompleteProperties
}

export interface AutocompleteGeometry {
    type: string
    coordinates: number[]
}

export interface AutocompleteProperties {
    label: string
    score: number
    _score: number
    housenumber?: string
    id: string
    name: string
    postcode: string
    citycode: string
    x: number
    y: number
    city: string
    district?: string
    context: string
    type: string
    _type: string
    importance: number
    street?: string
}
