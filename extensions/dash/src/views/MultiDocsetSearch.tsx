import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { useState } from "react";
import DashResult from "../components/DashResult";
import { useDocsets, useDocsetSearch } from "../hooks";
import { Docset } from "../types";
import SingleDocsetSearch from "./SingleDocsetSearch";

const getFilteredDocsets = (docsets: Docset[], searchText: string) =>
  docsets.filter(
    (docset) =>
      docset.docsetName.toLowerCase().includes(searchText.toLowerCase()) ||
      docset.docsetKeyword.toLowerCase().includes(searchText.toLowerCase())
  );

export default function MultiDocsetSearch() {
  const [searchText, setSearchText] = useState("");
  const [docsets, isLoadingDocsets] = useDocsets();
  const [keyword, setKeyword] = useState("");
  const [searchResults, isLoadingSearchResults] = useDocsetSearch(searchText, keyword);
  const filteredDocsets = getFilteredDocsets(docsets, searchText);
  const docsetKeywords = docsets.map((item) => item.docsetKeyword);

  return (
    <List
      isLoading={isLoadingDocsets || isLoadingSearchResults}
      searchBarAccessory={<DocsetDropdown docsets={docsets} onKeywordChange={(newKeyword) => setKeyword(newKeyword)} />}
      searchBarPlaceholder="Filter docsets by name or keyword..."
      onSearchTextChange={(newValue) => {
        const setKeywordRegex = /(^\w+) /;
        const setKeyword = setKeywordRegex.test(newValue) && newValue.match(setKeywordRegex)?.[1];
        const isSetKeyWord = docsetKeywords.includes(setKeyword || "");
        const formattedNewValue = isSetKeyWord ? newValue.replace(setKeywordRegex, "$1:") : newValue;
        setSearchText(formattedNewValue.trim());
      }}
    >
      <List.Section title="Docsets">
        {filteredDocsets.map((docset) => (
          <DocsetListItem key={docset.docsetPath} docset={docset} />
        ))}
      </List.Section>
      <List.Section title="Search Results">
        {searchResults.map((result, index) => (
          <DashResult result={result} index={index} key={index} />
        ))}
      </List.Section>
    </List>
  );
}

function DocsetListItem({ docset }: { docset: Docset }) {
  const { push } = useNavigation();

  return (
    <List.Item
      title={docset.docsetName}
      subtitle={docset.docsetKeyword}
      icon={docset.iconPath}
      actions={
        <ActionPanel>
          <Action title="Open" onAction={() => push(<SingleDocsetSearch docset={docset} />)} />
        </ActionPanel>
      }
    />
  );
}

function DocsetDropdown({
  docsets,
  onKeywordChange,
}: {
  docsets: Docset[];
  onKeywordChange: (keyword: string) => void;
}) {
  return (
    <List.Dropdown tooltip="Select Docset" storeValue={true} onChange={(newValue) => onKeywordChange(newValue)}>
      <>
        <List.Dropdown.Item key="all" title="All" value={""} icon={Icon.Circle} />
        {docsets.map((docset) => (
          <List.Dropdown.Item
            key={docset.docsetBundle}
            title={docset.docsetName}
            icon={docset.iconPath ? { source: docset.iconPath } : undefined}
            value={docset.docsetKeyword}
          />
        ))}
      </>
    </List.Dropdown>
  );
}
