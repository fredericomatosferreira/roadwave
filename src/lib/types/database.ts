export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      roadmaps: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          visibility: "public" | "private" | "unlisted";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          visibility?: "public" | "private" | "unlisted";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          slug?: string;
          visibility?: "public" | "private" | "unlisted";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roadmaps_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      columns: {
        Row: {
          id: string;
          roadmap_id: string;
          title: string;
          position: number;
        };
        Insert: {
          id?: string;
          roadmap_id: string;
          title: string;
          position: number;
        };
        Update: {
          id?: string;
          roadmap_id?: string;
          title?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "columns_roadmap_id_fkey";
            columns: ["roadmap_id"];
            isOneToOne: false;
            referencedRelation: "roadmaps";
            referencedColumns: ["id"];
          },
        ];
      };
      cards: {
        Row: {
          id: string;
          column_id: string;
          roadmap_id: string;
          title: string;
          description: string | null;
          status: "planned" | "in_progress" | "done";
          tag: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          column_id: string;
          roadmap_id: string;
          title: string;
          description?: string | null;
          status?: "planned" | "in_progress" | "done";
          tag?: string | null;
          position: number;
        };
        Update: {
          id?: string;
          column_id?: string;
          roadmap_id?: string;
          title?: string;
          description?: string | null;
          status?: "planned" | "in_progress" | "done";
          tag?: string | null;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cards_column_id_fkey";
            columns: ["column_id"];
            isOneToOne: false;
            referencedRelation: "columns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cards_roadmap_id_fkey";
            columns: ["roadmap_id"];
            isOneToOne: false;
            referencedRelation: "roadmaps";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Roadmap = Database["public"]["Tables"]["roadmaps"]["Row"];
export type Column = Database["public"]["Tables"]["columns"]["Row"];
export type Card = Database["public"]["Tables"]["cards"]["Row"];
