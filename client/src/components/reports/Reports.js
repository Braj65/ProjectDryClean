import React, { Component } from "react";
import { connect } from "react-redux";
import "react-dates/initialize";
import "./_datepicker.css?external";
import presetclass from "./presetdatepicker.css";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
import { fetchReport } from "../../actions/reportActions";
import isSameDay from "./isSameDay";
import moment from "moment";
import Select from "react-select";
import PropTypes from "prop-types";
import Tux from "../hoc/Tux";
import "./react-select.css?external";
import Saleslist from "./Saleslist";
import { withStyles, css } from "react-with-styles";
const SHOPNAMES = require("../../data/shopnames");

let total = 0;
const today = moment();
const yesterday = moment().subtract(1, "day");
const presets = [
  {
    text: "Today",
    start: today.startOf("day"),
    end: today.endOf("day")
  },
  {
    text: "Yesterday",
    start: yesterday.startOf("day"),
    end: yesterday.endOf("day")
  },
  {
    text: "Last Week",
    start: today
      .clone()
      .subtract(1, "week")
      .startOf("day"),
    end: today.endOf("day")
  },
  {
    text: "Last Month",
    start: today
      .clone()
      .subtract(1, "month")
      .startOf("day"),
    end: today.endOf("day")
  }
];
let map = new Map();
// let shops = [];
class Reports extends Component {
  constructor() {
    super();

    this.state = {
      clearable: false,
      searchable: false,
      selectedShop: "All",
      startDate: today.clone().startOf("day"),
      endDate: today.clone().endOf("day"),
      focusedInput: null
    };
    this.renderDatePresets = this.renderDatePresets.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
  }

  componentDidUpdate(nextProps) {
    let salelist = {};

    if (nextProps.salestats) {
      let stats = nextProps.salestats;
      stats.map(daydetails => {
        let date = moment(daydetails.date).format("DD/MMM/YYYY");
        if (map.has(date)) {
          daydetails.orderids.map(orderid => {
            total = total + Math.trunc(orderid.totalprice);
          });
          console.log("&&&&&&&&&&&&&&&&&&&&&& ", daydetails.shopid);
          console.log("&&&&&&&&&&&&&&&&&&&&&& ", total);
          salelist = map.get(date);
          salelist[daydetails.shopid] = total;
          map.set(date, salelist);
          for (const [key, value] of map) {
            console.log(`key:${key}, value:${value}`);
            const totaldetails = value;
            Object.keys(totaldetails).map(totskey => {
              console.log(totskey);
              console.log(totaldetails[totskey]);
            });
          }
        } else {
          salelist = {};
          daydetails.orderids.map(orderid => {
            total = total + Math.trunc(orderid.totalprice);
          });
          console.log("&&&&&&&&&&&&&&&&&&&&&& ", daydetails.shopid);
          console.log("&&&&&&&&&&&&&&&&&&&&&& ", total);
          salelist[daydetails.shopid] = total;
          map.set(date, salelist);
          for (const [key, value] of map) {
            console.log(`key:${key}, value:${value}`);
          }
        }
        total = 0;
        /* for (const [key, value] of map) {
          const totaldetails = value;
          Object.keys(totaldetails).map(totskey => {
            shops.push(totskey);
          });
        } */
      });
    }
  }

  clearValue = event => {
    this.select.setInputValue("");
  };

  setNewValue = event => {
    if (event) {
      this.setState({ selectedShop: event.value });
      // this.props.updateValue(event);
    } else {
      this.setState({ selectedShop: "" });
      // this.props.cleared();
    }
  };

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  renderDatePresets() {
    const { startDate, endDate } = this.state;

    return (
      <div className={presetclass.PresetDateRangePicker_panel}>
        {presets.map(({ text, start, end }) => {
          const isSelected =
            isSameDay(start, startDate) && isSameDay(end, endDate);
          return (
            <button
              key={text}
              className={
                (presetclass.PresetDateRangePicker_button,
                isSelected
                  ? presetclass.PresetDateRangePicker_button__selected
                  : null)
              }
              type="button"
              onClick={() =>
                this.onDatesChange({ startDate: start, endDate: end })
              }
            >
              {text}
            </button>
          );
        })}
      </div>
    );
  }

  onfetch = event => {
    const start = this.state.startDate.startOf("day");
    const end = this.state.endDate.endOf("day");
    total = 0;
    const reportparams = {
      startdate: start,
      enddate: end,
      selectedshop: this.state.selectedShop
    };
    this.props.fetchReport(reportparams);
  };

  render() {
    var options = SHOPNAMES["shopnames"];
    const { salestats } = this.props.fetchedreport;

    return (
      <Tux>
        <div className="section" style={{ width: "30%", margin: "35px auto" }}>
          <Select
            id={"selected-shop"}
            placeholder={"Shopname"}
            options={options}
            clearable={this.state.clearable}
            disabled={this.state.disabled}
            value={this.state.selectedShop}
            searchable={this.state.searchable}
            onChange={event => {
              this.setNewValue(event);
            }}
          />
        </div>
        <DateRangePicker
          key={
            this.state.startDate
              ? this.state.startDate.format("DD MMM YY")
              : this.state.endDate.format("DD MMM YY")
          }
          startDateId="startDate"
          endDateId="endDate"
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onDatesChange={({ startDate, endDate }) => {
            this.setState({ startDate, endDate });
          }}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => {
            this.setState({ focusedInput });
          }}
          minimumNights={0}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, today)}
          renderCalendarInfo={this.renderDatePresets}
          initialVisibleMonth={() => today.clone().subtract(1, "month")}
          displayFormat="DD MMM YY"
          showDefaultInputIcon
          inputIconPosition="after"
          small
          screenReaderInputMessage="Select from and to date"
        />
        <button onClick={this.onfetch}>Fetch</button>
        <div>{salestats ? salestats[0].shopid : null}</div>
        {salestats ? <Saleslist map={map} /> : null}
      </Tux>
    );
  }
}

Reports.propTypes = {
  searchable: PropTypes.bool,
  fetchReport: PropTypes.func.isRequired,
  salestats: PropTypes.object
};

const mapStateToProps = state => ({
  fetchedreport: state.report,
  salestats: state.report.salestats
});

export default connect(
  mapStateToProps,
  { fetchReport }
)(Reports);
