export interface Recipe {
  id_recipe: number;
  title: string;
  description: string;
  img_vignette?: string;
  user: [{ id_user: string; identifiant: string; role: string }];
  instructions?: {
    id_instruction: number;
    ordre: number;
    text_instruction: string;
  }[];
}
