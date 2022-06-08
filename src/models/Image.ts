
export enum Mediatype {
    Image = "Image",
    Movie = "Movie",
    All = "",
}

export interface Image {
    
    date:   Date;
    year:   string;
    month:  string;
    day:    string;
    hour:   string;
    minute: string; 

    sameday: string;
        
    dirname: string;
    dirname_logical: string;  // the logical folder, when a user moved after import
    dirname_physical: string; // the real S3 Storage

    orientation: string; // "90CW" || image.orientation === "90CCW"

    filename: string;
    source_url: string;

    id: string; // the id
    src: string; // the id, can be removed later

    faces:string[];
    nFaces: number; 
    rating: number;

    mediatype: Mediatype; // image / movie

    country: string;
    state: string;
    city: string;


    rotate: number; 
    
    width: number;
    height: number;
}

