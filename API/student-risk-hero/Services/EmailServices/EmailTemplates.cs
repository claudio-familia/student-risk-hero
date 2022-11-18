﻿namespace student_risk_hero.Services.EmailServices
{
    public static class EmailTemplates
    {
        public static string BasicTemplate(string title, string[] bodies, string action = null)
        {
            var bodyTemplate = "";
            var actionTemplate = "";

            foreach (var body in bodies)
            {
                bodyTemplate += "<tr> " +
                    "               <td class='content-block'> " +
                   $"                   {body}" +
                    "               </td> " +
                    "           </tr> ";
            }

            if(action != null)
            {
                actionTemplate = "<tr> " +
                        "           <td class='content-block aligncenter'> " +
                       $"               <a href='{action}' class='btn-primary'>Click here</a> " +
                        "           </td> " +
                        "        </tr> ";
            }

            return  "<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> "+
                    "<html xmlns='http://www.w3.org/1999/xhtml'> "+
                    "<head>" +
                    "    <meta name='viewport' content='width=device-width' />" +
                    "    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />" +
                   $"    <title>{title}</title>" +
            #region Email Styles
                    "    <style>" +
                    "* { " +
                    "    margin: 0; " +
                    "    padding: 0; " +
                    "    font-family: 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; " +
                    "    box-sizing: border-box; " +
                    "    font-size: 14px; " +
                    "} " +
                    "img { " +
                    "    max-width: 100%; " +
                    "} " +
                    "body { " +
                    "    -webkit-font-smoothing: antialiased; " +
                    "    -webkit-text-size-adjust: none; " +
                    "    width: 100% !important; " +
                    "    height: 100%; " +
                    "    line-height: 1.6; " +
                    "} " +
                    "table td { " +
                    "    vertical-align: top; " +
                    "} " +
                    "body { " +
                    "    background-color: #f6f6f6; " +
                    "} " +
                    ".body-wrap { " +
                    "    background-color: #f6f6f6; " +
                    "    width: 100%; " +
                    "} " +
                    ".container { " +
                    "    display: block !important; " +
                    "    max-width: 600px !important; " +
                    "    margin: 0 auto !important; " +
                    "    clear: both !important; " +
                    "} " +
                    ".content { " +
                    "    max-width: 600px; " +
                    "    margin: 0 auto; " +
                    "    display: block; " +
                    "    padding: 20px; " +
                    "} " +
                    ".main { " +
                    "    background: #fff; " +
                    "    border: 1px solid #e9e9e9; " +
                    "    border-radius: 3px; " +
                    "} " +
                    ".content-wrap { " +
                    "    padding: 20px; " +
                    "} " +
                    ".content-block { " +
                    "    padding: 0 0 20px; " +
                    "} " +
                    ".header { " +
                    "    width: 100%; " +
                    "    margin-bottom: 20px; " +
                    "} " +
                    ".footer { " +
                    "    width: 100%; " +
                    "    clear: both; " +
                    "    color: #999; " +
                    "    padding: 20px; " +
                    "} " +
                    ".footer a { " +
                    "    color: #999; " +
                    "} " +
                    ".footer a, " +
                    ".footer p, " +
                    ".footer td, " +
                    ".footer unsubscribe { " +
                    "    font-size: 12px; " +
                    "} " +
                    "h1, " +
                    "h2, " +
                    "h3 { " +
                    "    font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; " +
                    "    color: #000; " +
                    "    margin: 40px 0 0; " +
                    "    line-height: 1.2; " +
                    "    font-weight: 400; " +
                    "} " +
                    "h1 { " +
                    "    font-size: 32px; " +
                    "    font-weight: 500; " +
                    "} " +
                    "h2 { " +
                    "    font-size: 24px; " +
                    "} " +
                    "h3 { " +
                    "    font-size: 18px; " +
                    "} " +
                    "h4 { " +
                    "    font-size: 14px; " +
                    "    font-weight: 600; " +
                    "} " +
                    "ol, " +
                    "p, " +
                    "ul { " +
                    "    margin-bottom: 10px; " +
                    "    font-weight: 400; " +
                    "} " +
                    "ol li, " +
                    "p li, " +
                    "ul li { " +
                    "    margin-left: 5px; " +
                    "    list-style-position: inside; " +
                    "} " +
                    "a { " +
                    "    color: #1ab394; " +
                    "    text-decoration: underline; " +
                    "} " +
                    ".btn-primary { " +
                    "    text-decoration: none; " +
                    "    color: white; " +
                    "    background-color: #3f51b5; " +
                    "    border: solid #3f51b5; " +
                    "    border-width: 5px 10px; " +
                    "    line-height: 2; " +
                    "    font-weight: 700; " +
                    "    text-align: center; " +
                    "    cursor: pointer; " +
                    "    display: inline-block; " +
                    "    border-radius: 5px; " +
                    "    text-transform: capitalize; " +
                    "} " +
                    ".last { " +
                    "    margin-bottom: 0; " +
                    "} " +
                    ".first { " +
                    "    margin-top: 0; " +
                    "} " +
                    ".aligncenter { " +
                    "    text-align: center; " +
                    "} " +
                    ".alignright { " +
                    "    text-align: right; " +
                    "} " +
                    ".alignleft { " +
                    "    text-align: left; " +
                    "} " +
                    ".clear { " +
                    "    clear: both; " +
                    "} " +
                    "@media only screen and (max-width: 640px) { " +
                    "    h1, " +
                    "    h2, " +
                    "    h3, " +
                    "    h4 { " +
                    "        font-weight: 600 !important; " +
                    "        margin: 20px 0 5px !important; " +
                    "    } " +
                    "    h1 { " +
                    "        font-size: 22px !important; " +
                    "    } " +
                    "    h2 { " +
                    "        font-size: 18px !important; " +
                    "    } " +
                    "    h3 { " +
                    "        font-size: 16px !important; " +
                    "    } " +
                    "    .container { " +
                    "        width: 100% !important; " +
                    "    } " +
                    "    .content, " +
                    "    .content-wrap { " +
                    "        padding: 10px !important; " +
                    "    } " +
                    "} " +
                    "    </style>" +
            #endregion
                    "</head>" +
                    "<body>" +
                    "    <table class='body-wrap'>" +
                    "        <tr>" +
                    "            <td></td>" +
                    "            <td class='container' width='600'>" +
                    "                <div class='content'>" +
                    "                    <table class='main' width='100%' cellpadding='0' cellspacing='0'>" +
                    "                        <tr>" +
                    "                           <td class='content-wrap'> "+
                    "                                <table cellpadding='0' cellspacing='0'> "+
                    "                                    <tr> " +
                    "                                        <td> "+
                    "                                            <img class='img-responsive' src='https://scontent.fhex5-2.fna.fbcdn.net/v/t39.30808-6/315953357_5610605875674665_2412673102972905007_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeHoAhXnp6_41rUQRauprq57hSlCU59c_uSFKUJTn1z-5EMCvEIQV6Hd8SYmnXRWZ9_JLluk1v2roL_motgUivDt&_nc_ohc=rJBPt7k0sFoAX_KVZ0B&tn=AmeIgg_hq8PHLf4C&_nc_ht=scontent.fhex5-2.fna&oh=00_AfAkoPWEJkH8s791Vhc1nTrBDKP-JwPzjU2w_eHBUB2FsA&oe=637C0176' /> " +
                    "                                        </td> "+
                    "                                    </tr> "+
                    "                                    <tr> "+
                    "                                        <td class='content-block'> "+
                   $"                                            <h2>{title}</h2> "+
                    "                                        </td> "+
                    "                                    </tr> "+
                    $"{bodyTemplate} "+
                    $"{actionTemplate} "+
                    "                                </table> "+
                    "                            </td> "+
                    "                        </tr> "+
                    "                    </table> "+
                    "                    <div class='footer'> "+
                    "                        <table width='100%'> "+
                    "                            <tr> "+
                    "                                <td class='aligncenter content-block'>Follow <a href='https://twitter.com/tokischa_'>Student Risk Hero Company</a> on Twitter.</td> " +
                    "                            </tr> "+
                    "                        </table> "+
                    "                    </div> "+
                    "                </div> "+
                    "            </td> "+
                    "            <td></td> "+
                    "        </tr> "+
                    "    </table> "+
                    "</body> "+
                    "</html>";
        }
    }
}
