import { createClient } from "@supabase/supabase-js";

const client = () => createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);


export const set = async (key: string, value: any): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_3ee85c18").upsert({
    key,
    value
  });
  if (error) {
    throw new Error(error.message);
  }
};


export const get = async (key: string): Promise<any> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_3ee85c18").select("value").eq("key", key).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data?.value;
};


export const del = async (key: string): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_3ee85c18").delete().eq("key", key);
  if (error) {
    throw new Error(error.message);
  }
};


export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_3ee85c18").upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
  if (error) {
    throw new Error(error.message);
  }
};
export const mget = async (keys: string[]): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_3ee85c18").select("value").in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((d: any) => d.value) ?? [];
};


export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_3ee85c18").delete().in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
};


export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_3ee85c18").select("key, value").like("key", prefix + "%");
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((d: any) => d.value) ?? [];
};