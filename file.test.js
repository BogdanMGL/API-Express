const { calculatePrice, calculateProcessingTime, conversionToWorkingHours, calculateDeadline, calculation, PRICE_VALUES } = require("./file");


const listLang = ['rus', 'ukr', 'eng'];
const lang = listLang[0];
const { price, speed, minPrice, minLeadTime } = PRICE_VALUES[lang];
const string = 1523;

test("calculatePrice", () => {
    expect(calculatePrice(0, price, minPrice, 1)).toBe(50)
    expect(calculatePrice(0, price, minPrice, 1.2)).toBe(50)
    expect(calculatePrice(string, price, minPrice, 1)).toBeCloseTo(76.15)
    expect(calculatePrice(string, price, minPrice, 1.2)).toBeCloseTo(91.38)
})




test("calculateProcessingTime", () => {
    expect(calculateProcessingTime(0, speed, minLeadTime, 1)).toBe(1)
    expect(calculateProcessingTime(0, speed, minLeadTime, 1.2)).toBe(1)
    expect(calculateProcessingTime(string, speed, minLeadTime, 1)).toBeCloseTo(2)
    expect(calculateProcessingTime(string, speed, minLeadTime, 1.2)).toBeCloseTo(2)
})



expect.extend({
    workingHours(dateHours, minHours, maxHours) {
        const pass = dateHours >= minHours && dateHours < maxHours;
        if (pass) {
            return {
                message: () =>
                    `${dateHours} expected included in working hours `,
                pass: true,
            }
        } else {
            return {
                message: () =>
                    `${dateHours} NOT expected included in working hours `,
                pass: false,
            }
        }

    }
})

test("Working hours", () => {
    const date = new Date(2021, 4, 21, 5, 30)
    expect(conversionToWorkingHours(date).getDay()).not.toBe(0 && 6)
    expect(conversionToWorkingHours(date).getHours()).workingHours(10, 19)
        //expect(21).workingHours(10, 19)
        //expect(1).not.toBe(0 && 6)
})


test("Deadline", () => {
    const testDate = new Date(2021, 4, 21, 10, 30)
    const leadTime = 10
    const deadline = new Date(2021, 4, 22, 11, 30)
    expect(calculateDeadline(leadTime, testDate).getDay()).not.toBe(0 && 6)
    expect(calculateDeadline(leadTime, testDate).getHours()).workingHours(10, 19)
    expect(calculateDeadline(leadTime, testDate)).toEqual(deadline)

})

test("calculation", () => {
    const format = true
    const testDate = new Date(2021, 4, 21, 10, 44)

    const deadline = new Date(2021, 4, 21, 12, 0)
    const deadline2 = new Date(2021, 4, 21, 13, 0)

    expect(new Date(calculation(string, lang, format, testDate).deadline).getDay()).not.toEqual(0 && 6)
    expect(new Date(calculation(string, lang, format, testDate).deadline).getHours()).workingHours(10, 19)
    expect(calculation(0, lang, format, testDate)).toEqual({ totalPrice: 50, deadline: +deadline, leadTime: 1 })
    expect(calculation(string, lang, format, testDate)).toEqual({ totalPrice: 76.15, deadline: +deadline2, leadTime: 2 })
    expect(calculation(string, lang, false, testDate)).toEqual({ totalPrice: 91.38, deadline: +deadline2, leadTime: 2 })

})