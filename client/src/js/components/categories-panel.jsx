import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import EditCategory from './edit-category';


class CategoriesPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCategoryNames(categoryId) {
    return (
      <li key={categoryId} id={`category-${categoryId}`} className="pv2">
        <Link to={`/category/edit/${categoryId}`} className="link dark-blue hover-navy">{this.props.categories[categoryId].name}</Link>
      </li>
    );
  }

  renderCategoryForm() {
    if (this.props.children) {
      return (
        <EditCategory params={this.props.params} />
      );
    }
  }

  render() {
    if (!this.props.categories) {
      return (
        <div className="mw6 mw8-ns center">
          <p className="pa3">Loading...</p>
        </div>
      );
    }

    return (
      <div className="flex mw6 mw8-ns center ph3">
        <section className="w-100 w-50-ns">
          <h2>Edit Categories</h2>
          <ul className="flex flex-column flex-wrap vh-25 pl0 list">
            {Object.keys(this.props.categories).map((categoryId) => this.renderCategoryNames(categoryId))}
          </ul>
          <Link to={'/category/add'} className="w-20 link bn br2 ph3 pv2 mv3 white bg-dark-blue hover-bg-navy">Add Category</Link>
        </section>
        {this.renderCategoryForm()}
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  return {
    categories: state.categories
  }
};


export default connect(mapStateToProps)(CategoriesPanel);
