export const roleFlags = {
  unknown: 1,
  public: 2,
  author: 4,
  editor: 8,
  admin: 16,
  super: 32,
};

export const roles = [
  {name: 'Public', role:'public'},
  {name: 'Author', role:'author'},
  {name: 'Editor', role:'editor'},
  {name: 'Admin', role:'admin'},
  {name: 'Super', role:'super'},
];
