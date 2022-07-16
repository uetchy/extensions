import { useEffect } from "react";
import { useStore } from "./common/store";
import { View } from "./common/View";
import { searchResources } from "./common/zoteroApi";

export default function MyView() {
  const store = useStore(["results"], (_, q) => searchResources(q as string), true);
  const sectionNames = ["Search Results"];

  useEffect(() => {
    store.runQuery("");
  }, []);

  return (
    <View
      sectionNames={sectionNames}
      queryResults={store.queryResults}
      isLoading={store.queryIsLoading}
      onSearchTextChange={(text) => {
        store.runQuery(text);
      }}
      throttle
    />
  );
}
