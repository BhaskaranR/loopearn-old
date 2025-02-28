export function supabaseLoader({ src, width, quality }) {
  return `https://zbzuttddhnuawftrcspo.supabase.co/storage/v1/render/image/public/${src}?width=${width}&quality=${
    quality || 75
  }&resize=contain`;
}
