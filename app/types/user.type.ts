// types/user.type.ts

export interface User {
  id_user: number;
  identifiant: string;
  role: string;
  photo: string;
  recipes: [
    {
      id_recipe: number;
      title: string;
      description: string;
      img_vignette: string;
      instructions: [
        {
          id_instruction: number;
          text_instruction: string;
          ordre: number;
          
        }
      ];
    }
  ];
}
