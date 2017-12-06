import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, CheckboxFilter, TermQuery, TagCloud} from 'searchkit'
import './index.css'

const host = "http://10.114.32.130:9200/finna-fix/"
const searchkit = new SearchkitManager(host, {
  basicAuth:"elastic:elastic"
})

const FinnaHitsGridItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "https://www.finna.fi/Record/" + result._source.id
  let imageSrc = "http://api.finna.fi" + result._source.images  
  console.log(result);

  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={imageSrc} target="_blank">
        <img data-qa="thumbnail" alt="{{__html:source.title}}" className={bemBlocks.item("poster")} src={imageSrc} width="170"/>
      </a>        
        <div data-qa="format" className={bemBlocks.item("formats")} dangerouslySetInnerHTML={{__html:source.formats[0].translated}}></div>
        <div data-qa="year" className={bemBlocks.item("year")} dangerouslySetInnerHTML={{__html:source.year}}></div>
      <a href={url} target="_blank">
        <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></div>
      </a>
    </div>
  )
}

const FinnaHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "https://www.finna.fi/Record/" + result._source.id
  let imageSrc = "http://api.finna.fi" + result._source.images
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img data-qa="Image" src={imageSrc}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <div data-qa="format" className={bemBlocks.item("formats")} dangerouslySetInnerHTML={{__html:source.formats[0].translated}}></div>
        <h3 className={bemBlocks.item("year")}>{source.year}</h3>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">Finna demo</div>
            <SearchBox autofocus={true} searchOnChange={true} prefixQueryFields={["title^1","subjects^2"]}/>
          </TopBar>

        <LayoutBody>

          <SideBar>
            <RefinementListFilter id="formats" title="Format" field="formats.translated.keyword" operator="AND"/>
            <InputFilter id="subjects" searchThrottleTime={500} title="Subjects" placeholder="Search subjects" searchOnChange={true} queryFields={["subjects"]} />
            <RangeFilter field="year" id="year" min={1850} max={2018} showHistogram={true} title="Year"/>
            <NumericRefinementListFilter id="decade" title="Decade" field="year" options={[
              {title:"All"},
              {title:"1930s", from:1930, to:1939},
              {title:"1940s", from:1940, to:1949},
              {title:"1950s", from:1950, to:1959},
              {title:"1960s", from:1960, to:1969},
              {title:"1970s", from:1970, to:1979},
              {title:"1980s", from:1980, to:1989},
              {title:"1990s", from:1990, to:1999},
              {title:"2000->", from:2000, to:2020},
            ]}/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Newest", field:"year", order:"desc"},
                  {label:"Oldest", field:"year", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={16} highlightFields={["title"]}
                sourceFilter={["title", "id", "images", "year", "formats"]}
                hitComponents={[
                  {key:"grid", title:"Grid", itemComponent:FinnaHitsGridItem, defaultOption:true},
                  {key:"list", title:"List", itemComponent:FinnaHitsListItem}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"title"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
