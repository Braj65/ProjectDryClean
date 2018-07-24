import React, { Component } from "react";
import Tux from "../../../hoc/Tux";
import ClotheOptionsDropdown from "../Dropdown/Dropdown";

class OrderComponent extends Component {
  constructor() {
    super();
    this.state = {
      clothetypeSelected: false,
      clothequalitySelected: false
    };
    this.typeCleared = this.typeCleared.bind(this);
    this.qualityCleared = this.qualityCleared.bind(this);
    this.isTypeFilled = this.isTypeFilled.bind(this);
    this.isQualityFilled = this.isQualityFilled.bind(this);
  }

  typeCleared() {
    this.setState({ clothetypeSelected: false }, () => {
      this.props.allFieldsPopulated(
        this.state.clothequalitySelected && this.state.clothetypeSelected
      );
    });
  }
  qualityCleared() {
    this.setState({ clothequalitySelected: false }, () => {
      this.props.allFieldsPopulated(
        this.state.clothequalitySelected && this.state.clothetypeSelected
      );
    });
  }

  isTypeFilled() {
    const clothetypeSelected = true;
    this.setState({ clothetypeSelected }, () => {
      this.props.allFieldsPopulated(
        this.state.clothequalitySelected && this.state.clothetypeSelected
      );
    });
  }
  isQualityFilled() {
    this.setState({ clothequalitySelected: true }, () => {
      this.props.allFieldsPopulated(
        this.state.clothequalitySelected && this.state.clothetypeSelected
      );
    });
  }

  render() {
    return (
      <Tux>
        <div>Item no.- {this.props.itemid}</div>
        <span>
          <ClotheOptionsDropdown
            updateValue={event => {
              this.props.updateValue(event);
              this.isTypeFilled();
            }}
            type={this.props.clothetype}
            cleared={this.typeCleared}
          />
        </span>
        <span>
          <ClotheOptionsDropdown
            updateValue={event => {
              this.props.updateValue(event);
              this.isQualityFilled();
            }}
            type={this.props.clothequality}
            cleared={this.qualityCleared}
          />
        </span>

        <button
          onClick={event => {
            this.props.removeItem(event);
            this.props.removeOrderRow(this.props.itemid);
          }}
        >
          Delete
        </button>
      </Tux>
    );
  }
}

export default OrderComponent;