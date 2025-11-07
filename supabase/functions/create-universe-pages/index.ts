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

    const { universeId } = await req.json();

    if (!universeId) {
      return new Response(
        JSON.stringify({ error: "universeId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating pages for universe: ${universeId}`);

    // Get universe data
    const { data: universe, error: universeError } = await supabase
      .from("universes")
      .select("id, title")
      .eq("id", universeId)
      .single();

    if (universeError || !universe) {
      console.error("Universe not found:", universeError);
      return new Response(
        JSON.stringify({ error: "Universe not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const slugify = (text: string): string => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    const universeSlug = slugify(universe.title);
    let pagesCreated = 0;
    const errors: string[] = [];

    // Create universe page
    try {
      const { error } = await supabase.from("pages").insert({
        universe_id: universeId,
        type: "UNIVERSE",
        entity_id: universeId,
        slug: `/universes/${universeSlug}`,
        status: "PUBLISHED",
      });

      if (error) {
        if (!error.message.includes("duplicate key")) {
          errors.push(`Universe page: ${error.message}`);
        }
      } else {
        pagesCreated++;
      }
    } catch (e) {
      const error = e as Error;
      errors.push(`Universe page: ${error.message}`);
    }

    // Get all characters
    const { data: characters } = await supabase
      .from("characters")
      .select("id, name")
      .eq("universe_id", universeId);

    if (characters) {
      for (const character of characters) {
        try {
          const characterSlug = slugify(character.name);
          const { error } = await supabase.from("pages").insert({
            universe_id: universeId,
            type: "CHARACTER",
            entity_id: character.id,
            slug: `/universes/${universeSlug}/characters/${characterSlug}`,
            status: "PUBLISHED",
          });

          if (error) {
            if (!error.message.includes("duplicate key")) {
              errors.push(`Character ${character.name}: ${error.message}`);
            }
          } else {
            pagesCreated++;
          }
        } catch (e) {
          const error = e as Error;
          errors.push(`Character ${character.name}: ${error.message}`);
        }
      }
    }

    // Get all locations
    const { data: locations } = await supabase
      .from("locations")
      .select("id, name")
      .eq("universe_id", universeId);

    if (locations) {
      for (const location of locations) {
        try {
          const locationSlug = slugify(location.name);
          const { error } = await supabase.from("pages").insert({
            universe_id: universeId,
            type: "LOCATION",
            entity_id: location.id,
            slug: `/universes/${universeSlug}/locations/${locationSlug}`,
            status: "PUBLISHED",
          });

          if (error) {
            if (!error.message.includes("duplicate key")) {
              errors.push(`Location ${location.name}: ${error.message}`);
            }
          } else {
            pagesCreated++;
          }
        } catch (e) {
          const error = e as Error;
          errors.push(`Location ${location.name}: ${error.message}`);
        }
      }
    }

    // Get all events
    const { data: events } = await supabase
      .from("events")
      .select("id, name")
      .eq("universe_id", universeId);

    if (events) {
      for (const event of events) {
        try {
          const eventSlug = slugify(event.name);
          const { error } = await supabase.from("pages").insert({
            universe_id: universeId,
            type: "EVENT",
            entity_id: event.id,
            slug: `/universes/${universeSlug}/events/${eventSlug}`,
            status: "PUBLISHED",
          });

          if (error) {
            if (!error.message.includes("duplicate key")) {
              errors.push(`Event ${event.name}: ${error.message}`);
            }
          } else {
            pagesCreated++;
          }
        } catch (e) {
          const error = e as Error;
          errors.push(`Event ${event.name}: ${error.message}`);
        }
      }
    }

    // Get all objects
    const { data: objects } = await supabase
      .from("objects")
      .select("id, name")
      .eq("universe_id", universeId);

    if (objects) {
      for (const object of objects) {
        try {
          const objectSlug = slugify(object.name);
          const { error } = await supabase.from("pages").insert({
            universe_id: universeId,
            type: "OBJECT",
            entity_id: object.id,
            slug: `/universes/${universeSlug}/objects/${objectSlug}`,
            status: "PUBLISHED",
          });

          if (error) {
            if (!error.message.includes("duplicate key")) {
              errors.push(`Object ${object.name}: ${error.message}`);
            }
          } else {
            pagesCreated++;
          }
        } catch (e) {
          const error = e as Error;
          errors.push(`Object ${object.name}: ${error.message}`);
        }
      }
    }

    console.log(`Pages created: ${pagesCreated}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        universeId,
        pagesCreated,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating pages:", error);
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});