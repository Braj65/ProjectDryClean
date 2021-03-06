import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import {
  deliverorder,
  clearOrders,
  changeOrderidStatus,
  clearOrderidStatus
} from "../../actions/deliverActions";
import Orderrows from "./Deliver/OrderRows/Orderrows";
import OrderDetails from "./Deliver/OrderRows/OrderDetails";
import Modal from "../ui/Modal/Modal";
import Backdrop from "../ui/Backdrop/Backdrop";
import Tux from "../hoc/Tux";

class Deliver extends Component {
  constructor() {
    super();
    this.state = {
      user: { mobilenumber: "" },
      errors: {},
      orderid: {},
      clothesinorderid: [],
      showOrderDetails: false,
      currentpage: null
    };
    this.onUserChange = this.onUserChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.populateSelectedOrderid = this.populateSelectedOrderid.bind(this);
    this.closeOrderDetails = this.closeOrderDetails.bind(this);
    this.changeOrderidState = this.changeOrderidState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onUserChange(event) {
    let user = this.state.user;
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  clearOrdersStore = event => {
    event.preventDefault();
    this.props.clearOrders();
    this.props.history.push("/");
  };

  populateSelectedOrderid(orderid, showOrderDetails, currentpage) {
    this.setState({ showOrderDetails, orderid, currentpage });
  }
  closeOrderDetails() {
    this.setState({ showOrderDetails: false });
    this.props.clearOrders();
    const searchUser = {
      mobilenumber: this.state.user["mobilenumber"]
    };
    const newSearch = {
      user: searchUser
    };
    this.props.deliverorder(newSearch);
  }

  changeOrderidState(orderid, newState) {
    // let beforeloading = this.props.fetchstatus;
    const updateorderid = {
      orderid: orderid._id,
      newState: newState
    };
    this.props.changeOrderidStatus(updateorderid);
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const searchUser = {
      mobilenumber: this.state.user["mobilenumber"]
    };
    const newSearch = {
      user: searchUser
    };
    this.props.deliverorder(newSearch);
  }

  render() {
    const { errors } = this.state;
    return (
      <Tux>
        <OrderDetails
          show={this.state.showOrderDetails}
          closeOrderDetails={this.closeOrderDetails}
          changeOrderidState={this.changeOrderidState}
          fullUser={this.props.userentry}
          orderid={
            this.props.updatedorderid
              ? this.props.updatedorderid
              : this.state.orderid
          }
          key={new Date().getTime()}
        />
        <div className="container">
          <h1 style={{ textAlign: "center" }}>Deliver order</h1>
          <div style={{ width: "30%", margin: "35px auto" }}>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  className={classnames("form-control", {
                    "is-invalid": errors.mobilenumber
                  })}
                  type="number"
                  name="mobilenumber"
                  value={this.state.user["mobilenumber"]}
                  onChange={this.onUserChange}
                  placeholder="Customer cell no."
                />
                {errors.mobilenumber && (
                  <div className="invalid-feedback">{errors.mobilenumber} </div>
                )}
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-lg btn-default btn-lock">
                  Submit
                </button>
              </div>
            </form>
            <a onClick={this.clearOrdersStore.bind(this)}>Back</a>
            {/* <Link to="/initial" onClick={this.handleClick.bind(this)}>
            Back
          </Link> */}
            {/*<Userdetails username={this.props.order.username}
            mobilenumber={this.props.order.mobilenumber}/>*/}
            <Backdrop show={this.props.fetchstatus} />
            <Modal show={this.props.fetchstatus} />
            <div>
              {this.props.userentry ? (
                <Orderrows
                  userentry={this.props.userentry}
                  populateSelectedOrderid={this.populateSelectedOrderid}
                  currentpage={this.state.currentpage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Tux>
    );
  }
}

Deliver.propTypes = {
  changeOrderidStatus: PropTypes.func,
  deliverorder: PropTypes.func.isRequired,
  userentry: PropTypes.object,
  updatedorderid: PropTypes.object,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  userentry: state.orderDeliver.userentry,
  fetchstatus: state.orderDeliver.loading,
  updatedorderid: state.orderDeliver.updatedorderid,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { deliverorder, clearOrders, changeOrderidStatus, clearOrderidStatus }
)(withRouter(Deliver));
