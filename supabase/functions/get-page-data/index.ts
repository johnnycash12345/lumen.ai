import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { slug } = await req.json();

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "slug parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching page data for slug: ${slug}`);

    // Get page metadata
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    if (pageError || !page) {
      console.error("Page not found:", pageError);
      return new Response(
        JSON.stringify({ error: "Page not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let entityData = null;

    // Fetch entity data based on type
    switch (page.type) {
      case "UNIVERSE": {
        const { data: universe } = await supabase
          .from("universes")
          .select("*")
          .eq("id", page.entity_id)
          .single();

        const { data: characters } = await supabase
          .from("characters")
          .select("*")
          .eq("universe_id", page.universe_id);

        const { data: locations } = await supabase
          .from("locations")
          .select("*")
          .eq("universe_id", page.universe_id);

        const { data: events } = await supabase
          .from("events")
          .select("*")
          .eq("universe_id", page.universe_id)
          .order("timeline_order", { ascending: true, nullsFirst: false });

        const { data: objects } = await supabase
          .from("objects")
          .select("*")
          .eq("universe_id", page.universe_id);

        entityData = {
          ...universe,
          characters: characters || [],
          locations: locations || [],
          events: events || [],
          objects: objects || [],
        };
        break;
      }

      case "CHARACTER": {
        const { data: character } = await supabase
          .from("characters")
          .select("*")
          .eq("id", page.entity_id)
          .single();

        const { data: relationships } = await supabase
          .from("relationships")
          .select("*")
          .or(`source_id.eq.${page.entity_id},target_id.eq.${page.entity_id}`)
          .eq("universe_id", page.universe_id);

        const { data: events } = await supabase
          .from("events")
          .select("*")
          .eq("universe_id", page.universe_id);

        entityData = {
          ...character,
          relationships: relationships || [],
          events: events || [],
        };
        break;
      }

      case "LOCATION": {
        const { data: location } = await supabase
          .from("locations")
          .select("*")
          .eq("id", page.entity_id)
          .single();

        const { data: characters } = await supabase
          .from("characters")
          .select("*")
          .eq("universe_id", page.universe_id);

        const { data: events } = await supabase
          .from("events")
          .select("*")
          .eq("universe_id", page.universe_id);

        entityData = {
          ...location,
          characters: characters || [],
          events: events || [],
        };
        break;
      }

      case "EVENT": {
        const { data: event } = await supabase
          .from("events")
          .select("*")
          .eq("id", page.entity_id)
          .single();

        const { data: characters } = await supabase
          .from("characters")
          .select("*")
          .eq("universe_id", page.universe_id);

        const { data: location } = await supabase
          .from("locations")
          .select("*")
          .eq("universe_id", page.universe_id)
          .limit(1)
          .single();

        entityData = {
          ...event,
          characters: characters || [],
          location: location || null,
        };
        break;
      }

      case "OBJECT": {
        const { data: object } = await supabase
          .from("objects")
          .select("*")
          .eq("id", page.entity_id)
          .single();

        const { data: owner } = await supabase
          .from("characters")
          .select("*")
          .eq("universe_id", page.universe_id)
          .limit(1)
          .single();

        entityData = {
          ...object,
          owner: owner || null,
        };
        break;
      }
    }

    return new Response(
      JSON.stringify({
        page,
        data: entityData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching page data:", error);
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});