const APP_VERSION = "v2.0.0";
const DEFAULT_DATA = { version: APP_VERSION, updatedAt: "", peopleOptions: ["Evan","Gonca","Ainiya","Lin","Mom","全家"], items: [] };
function corsHeaders(env){return {"Access-Control-Allow-Origin":env.ALLOWED_ORIGIN||"*","Access-Control-Allow-Methods":"GET,PUT,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,X-App-Password","Cache-Control":"no-store"}}
function jsonResponse(body,status,env){return new Response(JSON.stringify(body),{status,headers:{...corsHeaders(env),"Content-Type":"application/json; charset=utf-8"}})}
function splitList(s){return String(s||"").split(/[\n,，;；]+/).map(x=>x.trim()).filter(Boolean)}
function normalizePayload(payload){
  if(!payload || typeof payload !== "object") throw new Error("Payload must be a JSON object");
  let items = Array.isArray(payload.items) ? payload.items : [];
  if(!items.length && Array.isArray(payload.rows)){
    items = payload.rows.map(r=>({id:r.id||crypto.randomUUID(),dateISO:r.dateISO||"",time:r.time||"",group:r.group||"",content:r.content||r.plan||"",links:Array.isArray(r.links)?r.links:splitList(r.links||r.link||""),participants:Array.isArray(r.participants)?r.participants:splitList(r.participants||"")}));
  }
  const peopleOptions = Array.isArray(payload.peopleOptions) ? payload.peopleOptions.map(String).filter(Boolean) : [];
  const normalizedItems = items.map((r,idx)=>({id:String(r.id||crypto.randomUUID()),dateISO:String(r.dateISO||""),time:String(r.time||""),group:String(r.group||r.section||""),content:String(r.content||r.plan||""),links:(Array.isArray(r.links)?r.links:splitList(r.links||r.link||"")).map(String).filter(Boolean),participants:(Array.isArray(r.participants)?r.participants:splitList(r.participants||"")).map(String).filter(Boolean),sort:typeof r.sort==="number"?r.sort:idx}));
  normalizedItems.forEach(i=>i.participants.forEach(p=>{if(!peopleOptions.includes(p)) peopleOptions.push(p)}));
  return {version:APP_VERSION,updatedAt:payload.updatedAt||new Date().toISOString(),peopleOptions,items:normalizedItems};
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(env);
    if(request.method === "OPTIONS") return new Response(null,{status:204,headers});
    if(url.pathname !== "/" && url.pathname !== "/data.json") return jsonResponse({ok:false,error:"Not found"},404,env);
    if(!env.TRAVEL_DATA) return jsonResponse({ok:false,error:"Missing KV binding: TRAVEL_DATA"},500,env);
    if(request.method === "GET"){
      const stored = await env.TRAVEL_DATA.get("data.json");
      return new Response(stored || JSON.stringify(DEFAULT_DATA), {headers:{...headers,"Content-Type":"application/json; charset=utf-8"}});
    }
    if(request.method === "PUT" || request.method === "POST"){
      if(env.APP_PASSWORD){
        const password = request.headers.get("X-App-Password") || "";
        if(password !== env.APP_PASSWORD) return jsonResponse({ok:false,error:"Unauthorized"},401,env);
      }
      const text = await request.text();
      if(text.length > 1024*1024) return jsonResponse({ok:false,error:"JSON too large"},413,env);
      let payload;
      try{payload=normalizePayload(JSON.parse(text))}catch(e){return jsonResponse({ok:false,error:e.message||"Invalid JSON"},400,env)}
      await env.TRAVEL_DATA.put("data.json", JSON.stringify(payload));
      return jsonResponse({ok:true,updatedAt:payload.updatedAt,version:payload.version},200,env);
    }
    return jsonResponse({ok:false,error:"Method not allowed"},405,env);
  }
};