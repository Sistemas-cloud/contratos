/**
 * Tipos generados automáticamente desde Supabase
 * Ejecuta: npx supabase gen types typescript --project-id "your-project-id" --schema public > lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuario: {
        Row: {
          usuario_id: number
          usuario_username: string
          usuario_password: string
          usuario_nombre: string
          usuario_app: string | null
          usuario_apm: string | null
          nivel: number | null
        }
        Insert: {
          usuario_id?: number
          usuario_username: string
          usuario_password: string
          usuario_nombre: string
          usuario_app?: string | null
          usuario_apm?: string | null
          nivel?: number | null
        }
        Update: {
          usuario_id?: number
          usuario_username?: string
          usuario_password?: string
          usuario_nombre?: string
          usuario_app?: string | null
          usuario_apm?: string | null
          nivel?: number | null
        }
      }
      contrato_determinado: {
        Row: {
          id: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_contrato: string
          fecha_termino: string
          sueldo_mensual: number
          dias: string
          hora_entrada: string
          hora_salida: string
          funciones: string
          bene1: string | null
          paren1: string | null
          porc1: number | null
          bene2: string | null
          paren2: string | null
          porc2: number | null
          testigo1: string | null
          testigo2: string | null
          nivel: number
          nombre_act: string | null
          fecha_registro: string
          ultima_act: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_contrato: string
          fecha_termino: string
          sueldo_mensual: number
          dias: string
          hora_entrada: string
          hora_salida: string
          funciones: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          puesto?: string
          nacionalidad?: string
          edad?: number
          e_civil?: string
          rfc?: string
          domicilio?: string
          curp?: string
          fecha_contrato?: string
          fecha_termino?: string
          sueldo_mensual?: number
          dias?: string
          hora_entrada?: string
          hora_salida?: string
          funciones?: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      contrato_indeterminado: {
        Row: {
          id: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_leido: string
          fecha_inicio: string
          fecha_contrato: string
          salario: number
          dias: string
          hora_entrada: string
          hora_salida: string
          funciones: string
          bene1: string | null
          paren1: string | null
          porc1: number | null
          bene2: string | null
          paren2: string | null
          porc2: number | null
          testigo1: string | null
          testigo2: string | null
          nivel: number
          nombre_act: string | null
          fecha_registro: string
          ultima_act: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_leido: string
          fecha_inicio: string
          fecha_contrato: string
          salario: number
          dias: string
          hora_entrada: string
          hora_salida: string
          funciones: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          puesto?: string
          nacionalidad?: string
          edad?: number
          e_civil?: string
          rfc?: string
          domicilio?: string
          curp?: string
          fecha_leido?: string
          fecha_inicio?: string
          fecha_contrato?: string
          salario?: number
          dias?: string
          hora_entrada?: string
          hora_salida?: string
          funciones?: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      contrato_hora: {
        Row: {
          id: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_inicio_esc: string
          fecha_termino_esc: string
          fecha_contrato: string
          dias: string
          hora_entrada: string
          hora_salida: string
          costo_hora: number
          funciones: string
          bene1: string | null
          paren1: string | null
          porc1: number | null
          bene2: string | null
          paren2: string | null
          porc2: number | null
          testigo1: string | null
          testigo2: string | null
          nivel: number
          nombre_act: string | null
          fecha_registro: string
          ultima_act: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          nombre: string
          puesto: string
          nacionalidad: string
          edad: number
          e_civil: string
          rfc: string
          domicilio: string
          curp: string
          fecha_inicio_esc: string
          fecha_termino_esc: string
          fecha_contrato: string
          dias: string
          hora_entrada: string
          hora_salida: string
          costo_hora: number
          funciones: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          puesto?: string
          nacionalidad?: string
          edad?: number
          e_civil?: string
          rfc?: string
          domicilio?: string
          curp?: string
          fecha_inicio_esc?: string
          fecha_termino_esc?: string
          fecha_contrato?: string
          dias?: string
          hora_entrada?: string
          hora_salida?: string
          costo_hora?: number
          funciones?: string
          bene1?: string | null
          paren1?: string | null
          porc1?: number | null
          bene2?: string | null
          paren2?: string | null
          porc2?: number | null
          testigo1?: string | null
          testigo2?: string | null
          nivel?: number
          nombre_act?: string | null
          fecha_registro?: string
          ultima_act?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
