import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import WheelPicker from './WheelPicker';
import moment from 'moment';

class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);

        this.selectedDate = this.props.initDate ? new Date(this.props.initDate) : new Date();
        const time12format = hourTo12Format(this.selectedDate.getHours());
        const time24format = this.selectedDate.getHours();
        
        this.initDayInex = 0;
        let datesArray = [];
        for (var i = 0; i < this.props.daysCount; i++) {
            let newDate = new Date(this.props.startDate);
            newDate.setDate(newDate.getDate() + i);
            datesArray.push(newDate);
            if (newDate.getDate() === this.selectedDate.getDate()) {
                this.initDayInex = i;
            }
        }
        this.datesArray = datesArray;
        this.initHourInex = this.props.format24 ? time24format : time12format[0] - 1;
        this.initMinuteInex = this.props.minutes ?
            this.props.minutes.findIndex(item => parseInt(item) === parseInt(this.selectedDate.getMinutes())) :
            Math.round(this.selectedDate.getMinutes() / 5);
        this.initAmInex = time12format[1] === 'AM' ? 0 : 1;
    }

    render() {
        return (
            <View style={[styles.container, this.props.width && {width: this.props.width}]}>
                <WheelPicker
                    style={styles.dateWheelPicker}
                    isAtmospheric
                    isCurved
                    visibleItemCount={8}
                    data={this.props.days ? this.props.days : PickerDateArray(this.props.startDate, this.props.daysCount)}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onDaySelected(data)}
                    selectedItemPosition={this.initDayInex}
                />
                <WheelPicker
                    style={styles.wheelPicker}
                    isAtmospheric
                    isCyclic
                    isCurved
                    visibleItemCount={8}
                    data={this.props.hours ? this.props.hours : getHoursArray()}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onHourSelected(data)}
                    selectedItemPosition={this.initHourInex}
                />
                <WheelPicker
                    style={styles.wheelPicker}
                    isAtmospheric
                    isCyclic
                    isCurved
                    visibleItemCount={8}
                    data={this.props.minutes ? this.props.minutes : getFiveMinutesArray()}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onMinuteSelected(data)}
                    selectedItemPosition={this.initMinuteInex}
                />
                {this.renderAm()}
            </View>
        );
    }

    renderAm() {
        if (!this.props.format24) {
            return (
                <WheelPicker
                    style={styles.wheelPicker}
                    isAtmospheric
                    isCurved
                    visibleItemCount={8}
                    data={getAmArray()}
                    selectedItemTextColor={'black'}
                    onItemSelected={data => this.onAmSelected(data)}
                    selectedItemPosition={this.initAmInex}
                />
            );
        }
    }

    onDaySelected(event) {
        const hours = this.selectedDate.getHours();
        const minutes = this.selectedDate.getMinutes();
        if (this.datesArray && this.datesArray[event.position]) {
            this.selectedDate = new Date(this.datesArray[event.position]);
            this.selectedDate.setHours(hours);
            this.selectedDate.setMinutes(minutes);
            this.onDateSelected();
        }
    }

    onHourSelected(event) {
        if (this.props.format24) {
            this.selectedDate.setHours(event.data);
        } else {
            const time12format = hourTo12Format(this.selectedDate.getHours());
            const newTime12Format = `${event.data} ${time12format[1]}`;
            const selectedHour24format = hourTo24Format(newTime12Format);
            this.selectedDate.setHours(selectedHour24format);
        }
        this.onDateSelected();
    }

    onMinuteSelected(event) {
        this.selectedDate.setMinutes(event.data);
        this.onDateSelected();
    }

    onAmSelected(event) {
        const time12format = hourTo12Format(this.selectedDate.getHours());
        const newTime12Format = `${time12format[0]} ${event.data}`;
        const selectedHour24format = hourTo24Format(newTime12Format);
        this.selectedDate.setHours(selectedHour24format);
        this.onDateSelected();
    }

    onDateSelected() {
        if (this.props.onDateSelected) {
            this.props.onDateSelected(this.selectedDate);
        }
    }

}

DateTimePicker.propTypes = {
    width: React.PropTypes.number,
    initDate: React.PropTypes.string,
    onDateSelected: React.PropTypes.func,
    startDate: React.PropTypes.string,
    daysCount: React.PropTypes.number,
    days: React.PropTypes.array,
    hours: React.PropTypes.array,
    minutes: React.PropTypes.array,
    format24: React.PropTypes.bool,
};

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    wheelPicker: {
        height: 170,
        width: null,
        flex: 1,
    },
    dateWheelPicker: {
        height: 200,
        width: null,
        flex: 3,
    },
});

// it takes in format '12 AM' and return 24 format
function hourTo24Format(hour) {
    return parseInt(moment(hour, ['h A']).format('H'), 10);
}

// it takes in format 23 and return [11,'PM'] format
function hourTo12Format(hour) {
    const currDate = new Date();
    currDate.setHours(hour);
    return dateTo12Hour(currDate.toISOString());
}

const dateTo12Hour = (dateString) => {
    const localDate = new Date(dateString);
    let hour = localDate.getHours();
    if (hour === 12) {
        return [('12'), ('PM')];
    }
    if (hour === 0) {
        return [('12'), ('AM')];
    }
    const afterMidday = hour % 12 === hour;
    hour = afterMidday ? hour : hour % 12;
    const amPm = afterMidday ? 'AM' : 'PM';
    return [(hour.toString()), (amPm)];
};

function increaseDateByDays(date, numOfDays) {
    const nextDate = new Date(date.valueOf());
    nextDate.setDate(nextDate.getDate() + numOfDays);
    return nextDate;
}

const PickerDateArray = (startDate, daysCount) => {
    startDate = startDate ? new Date(startDate) : new Date();
    daysCount = daysCount ? daysCount : 365;
    const arr = [];
    for (let i = 0; i < daysCount; i++) {
        if (i === 0 && startDate.getDate() === new Date().getDate()) {
            arr.push('Today');
        } else {
            arr.push(formatDatePicker(new Date(new Date().setDate(startDate.getDate() + i))));
        }
    }
    return arr;
};

function formatDatePicker(date) {
    const strDate = moment(date).format('ddd MMM D');
    return strDate;
}

function getHoursArray() {
    const arr = [];
    for (let i = 1; i < 13; i++) {
        arr.push(i);
    }
    return arr;
}

function getFiveMinutesArray() {
    const arr = [];
    arr.push('00');
    arr.push('05');
    for (let i = 10; i < 60; i += 5) {
        arr.push(`${i}`);
    }
    return arr;
}

function getAmArray() {
    const arr = [];
    arr.push('AM');
    arr.push('PM');
    return arr;
}

module.exports = DateTimePicker;
