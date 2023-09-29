declare module 'remark-typescript' {
    
    import {Plugin} from 'remark-typescript';  
  
    /**
     * Remark plugin to remove Markdown links, images, references, and definitions.
     */
    declare const remarkTypescript: Plugin;
  
    export = remarkTypescript;
  }