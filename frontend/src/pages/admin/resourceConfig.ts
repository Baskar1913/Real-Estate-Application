export type FieldType = "text" | "number" | "textarea" | "file" | "checkbox" | "select";
export interface FieldConfig { key: string; label: string; type: FieldType; required?: boolean; optionsEndpoint?: string; choices?: {value:string;label:string}[] }
export interface ResourceConfig { endpoint: string; label: string; singular: string; fields: FieldConfig[] }

const commonProperty: FieldConfig[] = [
  {key:"title",label:"Title",type:"text",required:true},
  {key:"banner",label:"Banner image",type:"file"},
  {key:"price",label:"Price",type:"number",required:true},
  {key:"location",label:"Location",type:"select",optionsEndpoint:"locations",required:true},
  {key:"category",label:"Category",type:"select",optionsEndpoint:"categories",required:true},
  {key:"subcategory",label:"Subcategory",type:"select",optionsEndpoint:"subcategories",required:true},
  {key:"no_of_bedrooms",label:"Bedrooms",type:"number",required:true},
  {key:"no_of_washrooms",label:"Washrooms",type:"number",required:true},
  {key:"area",label:"Area (Sq.ft)",type:"number",required:true},
  {key:"description",label:"Description",type:"textarea",required:true},
  {key:"app_id",label:"App ID",type:"number",required:true},
];

export const resources: Record<string,ResourceConfig> = {
  "contact-info": {endpoint:"contact-info",label:"Contact Details",singular:"Contact details",fields:[{key:"phone",label:"Phone number",type:"text",required:true},{key:"email",label:"Email address",type:"text",required:true},{key:"address",label:"Office address",type:"textarea",required:true},{key:"map_url",label:"Google Maps URL",type:"text"},{key:"app_id",label:"App ID",type:"number",required:true}]},
  "about-us": {endpoint:"about-us",label:"About Us",singular:"About section",fields:[{key:"banner",label:"Banner",type:"file"},{key:"image",label:"Section image",type:"file"},{key:"title1",label:"Primary title",type:"text",required:true},{key:"title2",label:"Secondary title",type:"text"},{key:"description",label:"Description",type:"textarea",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  properties: {endpoint:"properties",label:"Properties",singular:"Property",fields:[...commonProperty,{key:"featured",label:"Featured property",type:"checkbox"}]},
  projects: {endpoint:"projects",label:"Projects",singular:"Project",fields:[...commonProperty,{key:"status",label:"Project status",type:"select",choices:[{value:"upcoming",label:"Upcoming"},{value:"ongoing",label:"Ongoing"},{value:"completed",label:"Completed"}]}]},
  amenities: {endpoint:"amenities",label:"Amenities",singular:"Amenity",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"feature_id",label:"Feature ID",type:"number",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  categories: {endpoint:"categories",label:"Categories",singular:"Category",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  subcategories: {endpoint:"subcategories",label:"Subcategories",singular:"Subcategory",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"category",label:"Category",type:"select",optionsEndpoint:"categories",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  countries: {endpoint:"countries",label:"Countries",singular:"Country",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  states: {endpoint:"states",label:"States",singular:"State",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"country",label:"Country",type:"select",optionsEndpoint:"countries",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
  locations: {endpoint:"locations",label:"Locations",singular:"Location",fields:[{key:"name",label:"Name",type:"text",required:true},{key:"country",label:"Country",type:"select",optionsEndpoint:"countries",required:true},{key:"state",label:"State",type:"select",optionsEndpoint:"states",required:true},{key:"app_id",label:"App ID",type:"number",required:true}]},
};
