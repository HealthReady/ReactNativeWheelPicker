import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import WheelPicker from './WheelPicker';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.selectedDate = this.props.initDate ? new Date(this.props.initDate) : new Date();
        this.initDateInex = this.selectedDate.getDate() - 1;
        this.initMonthInex = this.selectedDate.getMonth();
        this.initYearInex = PickerYearArray(this.props.initDate, this.props.minimumDate, this.props.maximumDate).indexOf(this.selectedDate.getFullYear());
    }

    render() {
        return (
            <View style={styles.container}>
                <WheelPicker
                    style={[styles.dateWheelPicker, {width: 30}, this.props.dateWheelPickerDateStyle]}
                    isAtmospheric
                    isCurved
                    visibleItemCount={8}
                    data={this.props.dates ? this.props.dates : PickerDateArray(this.selectedDate)}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onDateSelected(data)}
                    selectedItemPosition={this.initDateInex}
                />
                <WheelPicker
                    style={[styles.dateWheelPicker, {width: 120}, this.props.dateWheelPickerMonthStyle]}
                    isAtmospheric
                    isCurved
                    visibleItemCount={8}
                    data={this.props.months ? this.props.months : PickerMonthArray()}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onMonthSelected(data)}
                    selectedItemPosition={this.initMonthInex}
                />
                <WheelPicker
                    style={[styles.dateWheelPicker, {width: 80}, this.props.dateWheelPickerYearStyle]}
                    isAtmospheric
                    isCurved
                    visibleItemCount={8}
                    data={this.props.years ? this.props.years : PickerYearArray(this.props.initDate, this.props.minimumDate, this.props.maximumDate)}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onYearSelected(data)}
                    selectedItemPosition={this.initYearInex}
                />
            </View>
        );
    }

    onDateSelected(event) {
        this.selectedDate.setDate(event.data);
        this.onDateChanged();
    }

    onMonthSelected(event) {
        this.selectedDate.setMonth(event.position);
        this.onDateChanged();
    }

    onYearSelected(event) {
        this.selectedDate.setYear(event.data);
        this.onDateChanged();
    }

    onDateChanged() {
        if (this.props.onDateSelected) {
            this.props.onDateSelected(this.selectedDate);
        }
    }

}

DatePicker.propTypes = {
    dateWheelPickerDateStyle: React.PropTypes.object,
    dateWheelPickerMonthStyle: React.PropTypes.object,
    dateWheelPickerYearStyle: React.PropTypes.object,
    initDate: React.PropTypes.string,
    onDateSelected: React.PropTypes.func,
    minimumDate: React.PropTypes.string,
    maximumDate: React.PropTypes.string,
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    wheelPicker: {
        height: 150,
        width: null,
        flex: 1,
    },
    dateWheelPicker: {
        height: 200,
        width: null,
        // Commented out for RN >0.47
        //flex: 3,
    },
});

const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

const PickerDateArray = (selectedDate) => {
    const days = daysInMonth(selectedDate.getMonth() + 1, selectedDate.getYear());
    const arr = [];
    for (let i = 1; i <= days; i++) {
        arr.push(i);
    }
    return arr;
};

const PickerMonthArray = () => {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
};

const PickerYearArray = (selectedDate, minimumDate, maximumDate) => {
    selectedDate = new Date(selectedDate);
    var years = [];
    const minDate = minimumDate ? new Date(minimumDate) : selectedDate;
    const maxDate = maximumDate ? new Date(maximumDate) : selectedDate;
    for (var i = minDate.getFullYear(); i <= maxDate.getFullYear(); i++){
        years.push(i);
    }
    return years;
};

module.exports = DatePicker;
