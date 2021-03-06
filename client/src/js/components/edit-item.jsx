import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { editItem } from '../actions/edit-item';
import { createItem } from '../actions/create-item';
import { fetchOwners } from '../actions/get-owners';
import { sanitizeNumber } from '../utils';
import { s3bucketName } from '../s3bucket-name';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import Datetime from 'react-datetime';


class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isImgUploadFinished: false,
      isRecUploadFinished: false,
      imgUrl: this.props.currentItem.image,
      recUrl: this.props.currentItem.receipt
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.handleRecUpload = this.handleRecUpload.bind(this);
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    if (!this.props.params.id) {
      this.props.dispatch(fetchOwners());
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    //dispatch to edit/add item
    const req = {
      ownerId: Object.keys(this.props.owners)[0],
      categoryId: this.refs.category.value,
      name: this.refs.name.value,
      replaceValue: sanitizeNumber(this.refs.replaceValue.value),
      notes: this.refs.notes.value,
      serialNumber: this.refs.serialNumber.value,
      purchaseDate: this.refs.purchaseDate.state.inputValue,
      placePurchased: this.refs.placePurchased.value,
      image: this.state.imgUrl,
      receipt: this.state.recUrl
    };

    if (this.props.params.id) {
      this.props.dispatch(editItem(this.props.currentItem._id, req));
    } else {
      this.props.dispatch(createItem(req));
    }
  }

  handleImgUpload(...image) {
    this.setState(
      prevState => ({
        isImgUploadFinished: !prevState.isImgUploadFinished,
        imgUrl: `https://${s3bucketName}.s3.amazonaws.com/${image[0].filename}`
      })
    );
  }

  handleRecUpload(...receipt) {
    this.setState(
      prevState => ({
        isRecUploadFinished: !prevState.isRecUploadFinished,
        recUrl: `https://${s3bucketName}.s3.amazonaws.com/${receipt[0].filename}`
      })
    );
  }

  renderDropZone(property) {
    let imgSrc = this.props.currentItem[property];
    if (this.state.isImgUploadFinished && property === 'image') {
      imgSrc = this.state.imgUrl;
    } else if (this.state.isRecUploadFinished && property === 'receipt') {
      imgSrc = this.state.recUrl;
    }

    const finishUpload = (property === 'image') ? this.handleImgUpload : this.handleRecUpload;

    return (
      <div>
        <p className="mt0 mb2 fw4 ttc">{property}:</p>
        <DropzoneS3Uploader onFinish={finishUpload} style={{backgroundColor: '#ffffff'}} activeStyle={{backgroundColor: '#fbf1a9'}} multiple={false} maxFileSize={1024*1024*50} s3Url={`https://${s3bucketName}.s3.amazonaws.com`} className={`flex justify-center items-center overflow-hidden h5 b--dashed bw1 b--black-20 br2 pointer`}>
          <img src={imgSrc} alt={this.props.currentItem.name} className="h4 nested-img img br2" />
        </DropzoneS3Uploader>
        <p className="mb4">{`Click or drag here to upload ${(property === 'image') ? 'an' : 'a'} ${property}.`}</p>
      </div>
    );
  }

  renderNotesTextArea(property) {
    return (
      <textarea name={property} id={property} className="hover-black h3 measure ba b--black-20 pa2 br2 mb3 fw2 sans-serif" defaultValue={this.props.currentItem[property]} ref={property}></textarea>
    );
  }

  renderDatePicker(property) {
    const dateInputProps = {
      id: 'purchaseDate',
      name: 'purchaseDate',
      className: 'db w-100 pa2 input-reset ba b--black-20 br2 fw2 sans-serif'
    };

    return (
      <Datetime closeOnSelect={true} timeFormat={false} dateFormat='ddd, MMM Do YYYY' inputProps={dateInputProps} className="mb3" defaultValue={this.props.currentItem[property]} ref={property} />
    );
  }

  renderCategorySelect() {
    return (
      <select name="category" id="category" className="pa2 mb3 fw2 sans-serif" defaultValue={this.props.currentItem.categoryId} ref="category">
        {Object.keys(this.props.categories).map((categoryId) => {
          return <option key={categoryId} id={`item-${categoryId}`} value={categoryId}>{this.props.categories[categoryId].name}</option>
        })}
      </select>
    );
  }

  renderInputs(property) {
    return (
      <input type="text" name={property} id={property} className="input-reset ba b--black-20 br2 pa2 mb3 fw2 sans-serif" defaultValue={this.props.currentItem[property]} ref={property} />
    );
  }

  renderForm(property, i) {
    let formField  = this.renderInputs(property);
    let labelValue = property;

    switch (property) {
      case 'notes' :
        formField = this.renderNotesTextArea(property);
        break;
      case 'purchaseDate' :
        labelValue = `${property.slice(0, 8)} ${property.slice(-4)}`;
        formField  = this.renderDatePicker(property);
        break;
      case 'categoryId' :
        labelValue = `${property.slice(0, 8)}`;
        formField  = this.renderCategorySelect();
        break;
      case 'serialNumber' :
        labelValue = `${property.slice(0, 6)} ${property.slice(-6)}`;
        break;
      case 'replaceValue' :
        labelValue = `${property.slice(0, 7)}ment ${property.slice(-5)}`;
        break;
      case 'placePurchased' :
        labelValue = `${property.slice(0, 5)} ${property.slice(-9)}`;
        break;
    }

    return (
      <div key={`${i}-${this.props.currentItem._id}`} className="flex flex-column mt0 mb2">
        <label htmlFor={property} className="mb2 fw4 ttc">{labelValue}:</label>
        {formField}
      </div>
    )
  }

  render() {
    const keys = Object.keys(this.props.currentItem).filter((property) => {
      return property !== '_id' && property !== '__v' && property !== 'ownerId' && property !== 'accessToken' && property !== 'image' && property !== 'receipt';
    });
    const sharedStyle = 'w-50 link bn br2 ph3 pv2 mv3 white fw4';

    return (
      <article className="mw6 mw8-ns center">
        <header className="mb4 bt bb b--black-20">
          <h2 className="ph3 fw3 f4 tracked">
            {(this.props.params.id) ? this.props.currentItem.name : 'Add an item'}
          </h2>
        </header>
        <div className="flex flex-column flex-row-ns ph3">
          <div className="order-2 order-1-ns w-100 w-50-ns mb3 mb0-ns mr4-ns">
            {this.renderDropZone('image')}
            {this.renderDropZone('receipt')}
          </div>
          <form className="flex flex-column order-1 order-2-ns mb4 mb0-ns w-100 w-50-ns" onSubmit={this.handleSubmit}>
            {keys.map((property, i) => this.renderForm(property, i))}

            <div className="flex flex-row">
              <Link to={`/item/${this.props.currentItem._id}`} className={`${sharedStyle} mr2 bg-mid-gray hover-bg-dark-gray tc`}>Cancel</Link>
              <button type="submit" className={`${sharedStyle} ml2 bg-dark-blue hover-bg-navy sans-serif`}>Save</button>
            </div>
          </form>
        </div>
      </article>
    );
  }
}


EditItem.defaultProps = {
  currentItem: {
    categoryId: '',
    name: '',
    serialNumber: '',
    notes: '',
    replaceValue: 0,
    purchaseDate: '',
    placePurchased: '',
    image: '/assets/image.svg',
    receipt: '/assets/image.svg',
  }
}


const mapStateToProps = (state, props) => {
  return {
    categories: state.categories,
    owners: state.owners,
    currentItem: state.items[props.params.id]
  }
};


export default connect(mapStateToProps)(EditItem);
