/**
 * Created by Chen on 06/03/14.
 */

var users = require('./users')
    , Job = require('../model/job')

exports.getFiltersData = function (req, res) {
    var data = {
        areas: [
            'ירושליים'
            , 'ירושלים'
            , 'תל אביב'
            , 'יקום'
            , 'חיפה'
            , 'קרית גת'
            , 'פתח תקוה'
            , 'יקנעם'
            , 'ראש העין'
            , 'בני ברק'
            , 'ראשון לציון'
            , 'קיסריה'
            , 'מגדל העמק'
            , 'רמת גן'
            , 'גבעתיים'
            , 'הרצלייה'
            , 'יהוד'
            , 'אור יהודה'
            , 'רחובות'
            , 'גבעת שמואל'
            , 'כפר סבא'
            , 'רעננה'
            , 'חולון'
            , 'רמת השרון'
            , 'הוד השרון'
            , 'יבנה'
            , 'קרית מוצקין'
            , 'קרית ביאליק'
            , 'טירת הכרמל'
            , 'באר שבע'
            , 'אילת'
            , 'חדרה'
            , 'נתניה'
        ],
        technologies: ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++', 'JavaScript']
    }
    return res.send(data);
};

