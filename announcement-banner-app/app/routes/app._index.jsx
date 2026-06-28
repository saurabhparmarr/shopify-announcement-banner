import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { connectDB, Announcement } from "../db.mongo.server.js";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const text = formData.get("announcement");

  
  const shopResponse = await admin.graphql(`#graphql
    query { shop { id } }
  `);
  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;


  await connectDB();
  await Announcement.create({ text, shop: session.shop });

  const response = await admin.graphql(
    `#graphql
    mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            namespace: "my_app",
            key: "announcement",
            value: text,
            type: "single_line_text_field",
            ownerId: shopId,
          },
        ],
      },
    },
  );

  const responseJson = await response.json();
  const userErrors = responseJson.data?.metafieldsSet?.userErrors;
  if (userErrors?.length > 0) {
    return { success: false, error: userErrors[0].message };
  }

  return { success: true, text };
};
export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const [announcement, setAnnouncement] = useState("");

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Announcement saved! ✅");
      setAnnouncement("");
    }
  }, [fetcher.data]);

  const handleSave = () => {
    if (!announcement.trim()) return;
    fetcher.submit({ announcement }, { method: "POST" });
  };

  return (
    <s-page heading="Announcement Banner">
      <s-section heading="Set Your Storefront Announcement">
        <s-paragraph>
          Type your announcement below. It will be saved to MongoDB and
          displayed on your storefront via Shopify metafields.
        </s-paragraph>

        <s-text-field
          label="Announcement Text"
          value={announcement}
          onInput={(e) => setAnnouncement(e.target.value)}
          placeholder="e.g. Sale 50% Off Today!"
        />

        <s-button
          onClick={handleSave}
          {...(isLoading ? { loading: true } : {})}
        >
          Save Announcement
        </s-button>

        {fetcher.data?.success && (
          <s-banner tone="success">✅ Saved: "{fetcher.data.text}"</s-banner>
        )}

        {fetcher.data?.error && (
          <s-banner tone="critical">❌ Error: {fetcher.data.error}</s-banner>
        )}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
