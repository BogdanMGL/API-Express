const PRICE_VALUES = {
    ukr: { price: 5, speed: 1333, minPrice: 5000, minLeadTime: 1 },
    rus: { price: 5, speed: 1333, minPrice: 5000, minLeadTime: 1 },
    eng: { price: 12, speed: 333, minPrice: 120000, minLeadTime: 1 },
};
const MIN_PROCESSING_TIME_HOURS = 0.5;
const lang = ['rus', 'ukr', 'eng'];

function calculation(characters, lang, format, date = new Date()) {
    console.log(date);
    const { price, speed, minPrice, minLeadTime } = PRICE_VALUES[lang];
    const formatCoff = format ? 1 : 1.2;
    const totalPrice = calculatePrice(characters, price, minPrice, formatCoff);
    const leadTime = calculateProcessingTime(characters, speed, minLeadTime, formatCoff);
    const deadline = calculateDeadline(leadTime, date);
    console.log({ totalPrice, deadline, leadTime });
    return { totalPrice, deadline: +deadline, leadTime }
}

function calculatePrice(characters, price, minPrice, formatCoff) {
    const calculatedPrice = characters * price * formatCoff;
    const result = (calculatedPrice > minPrice) ? calculatedPrice : minPrice;
    return +(result / 100).toFixed(2);
}

function calculateProcessingTime(characters, speed, minLeadTime, formatCoff) {
    const calculateTime = (MIN_PROCESSING_TIME_HOURS + characters / speed) * formatCoff;
    const result = (calculateTime > minLeadTime) ? calculateTime : minLeadTime;
    return +result.toFixed(1)
}


function calculateDeadline(leadTime, date) {
    let workingHours = new Date(date);
    workingHours = conversionToWorkingHours(workingHours);
    let result = new Date(workingHours);
    if (result.getHours() + leadTime >= 19 || result.getDate(result.getMinutes() + leadTime * 60) !== result.getDate()) {

        if (result.getHours() * 60 + result.getMinutes() + leadTime * 60 === 19 * 60) {
            return result.setHours(19, 0, 0)
        }

        let restTime = leadTime - (19 * 60 - (result.getHours() * 60 + result.getMinutes())) / 60;
        const restHours = (restTime / 9 > 1) ? restTime % 9 : restTime;

        do {
            if (result.getDay(result.getDate() + 1) === 6) {
                result.setDate(result.getDate() + 3);
            } else {
                result.setDate(result.getDate() + 1);
            }
            restTime -= 9
        }
        while (restTime > 0);

        if (restHours === 0) {
            return result.setHours(19, 0, 0, 0);
        } else {
            result.setHours(10, 0, 0, 0);
            result.setMinutes(result.getMinutes() + restHours * 60, 0, 0);
        }

    } else {
        result.setMinutes(result.getMinutes() + leadTime * 60, 0, 0);
    }
    return roundingToHalfAnHour(result)
}

function conversionToWorkingHours(date) {
    if (date.getHours() < 10) {
        date.setHours(10, 0, 0);
    } else if (date.getHours() >= 19) {
        date.setDate(date.getDate() + 1);
        date.setHours(10, 0, 0);
    }
    if (date.getDay() === 6) {
        date.setDate(date.getDate() + 2);
    } else if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }
    return date
}

function roundingToHalfAnHour(date) {
    if (date.getMinutes() <= 30 && date.getMinutes() !== 0) {
        date.setMinutes(30, 0, 0);
    } else if (date.getMinutes() > 30) {
        date.setMinutes(60, 0, 0);
    }
    return date
}

module.exports = { calculatePrice, calculateProcessingTime, conversionToWorkingHours, calculateDeadline, calculation, PRICE_VALUES, lang }
  
