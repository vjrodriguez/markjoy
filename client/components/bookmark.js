import React from 'react'
import {connect} from 'react-redux'
import {
  fetchBookmarks,
  fetchBookmarksByCategory,
  addBookmark,
  deleteBookmark
} from '../store/bookmark'
import {Grid, Button, Image} from 'semantic-ui-react'
import {Navbar} from './index'
import {CustomSidebar} from './sidemenu'

export class AllBookmarks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: ''
    }
    this.getBookmarks = this.getBookmarks.bind(this)
    this.pathChanged = this.pathChanged.bind(this)
  }

  getBookmarks(path) {
    let category = this.props.match.params.categoryId
    if (path && '123456'.includes(path.split('/')[0])) {
      const paths = path.split('/')
      category = parseInt(paths[paths.length - 1], 10)
      console.log(category, 'category')
    }
    if (category) {
      this.props.fetchBookmarksByCategory(category)
    } else {
      this.props.getBookmarks()
    }
  }

  componentDidMount() {
    this.getBookmarks()
    this.setState({
      path: location.pathname
    })
  }

  pathChanged() {
    const currPath = location.pathname
    if (this.state.path !== currPath) {
      this.getBookmarks(currPath)
      this.setState({
        path: currPath
      })
    }
  }

  render() {
    const bookmarks = this.props.bookmarks
    console.log(bookmarks, 'bookmarks')

    return (
      <div onClick={this.pathChanged}>
        <Navbar />
        <div style={{display: 'flex', height: '100vh'}}>
          <div className="container" style={{padding: '50px', flex: 1}}>
            <Button
              floated="right"
              // onClick={} dispatch sync-bookmark thunk
              content="Sync"
              color="teal"
            />
            <h1 className="title">All Bookmarks</h1>
            <div id="all-bookmarks-view" className="ui-grid">
              <Grid columns={4} relaxed="very" align="center">
                {bookmarks && bookmarks.length > 0
                  ? bookmarks.map(bookmark => {
                      return (
                        <div className="column" key={bookmark.id}>
                          <img src="/default.png" className="ui image" />
                        </div>
                      )
                    })
                  : 'No Bookmarks'}
              </Grid>
            </div>
          </div>
          <CustomSidebar />
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    bookmarks: state.bookmarks
  }
}

const mapDispatch = dispatch => {
  return {
    getBookmarks: () => dispatch(fetchBookmarks()),
    fetchBookmarksByCategory: (categoryId, userId) =>
      dispatch(fetchBookmarksByCategory(categoryId, userId)),
    addBookmark: bookmarkInfo => dispatch(addBookmark(bookmarkInfo)),
    deleteBookmark: bookmarkId => dispatch(deleteBookmark(bookmarkId))
  }
}

export default connect(mapState, mapDispatch)(AllBookmarks)
