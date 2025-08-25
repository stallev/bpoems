export interface Tag {
  id: string;
  name: string;
  nameId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagData {
  name: string;
  nameId: string;
}

export interface UpdateTagData {
  name?: string;
  nameId?: string;
}
