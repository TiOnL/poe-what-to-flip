import React from "react";
import PropTypes from "prop-types";
import { comparePrice, cost } from "../functions/compareItems";
import { useFindItems } from "../contexts/items";
import { isDefined } from "../functions/utils";

export const Comparison = ({ selectedLeague, comparison }) => {

  const useCompareText = (baseNames, compareNames) => {
    const baseItems = useFindItems(selectedLeague, baseNames);
    const compareItems = useFindItems(selectedLeague, compareNames);

    let text;

    if (baseItems.concat(compareItems).some(item => !isDefined(item))) {
      text = "N/A";
    } else {
      text = comparePrice(baseItems, compareItems);
    }

    return text;
  };

  const useCostText = names => {
    const pieces = names.length;
    const items = useFindItems(selectedLeague, names);

    let text;
    if (pieces === 0) {
      text = "";
    } else if (items.some(item => !isDefined(item))) {
      text = "N/A";
    } else {
      text = `, cost: ${cost(items)} chaos, pieces: ${pieces}`;
    }

    return text;
  };

  const ComparisonText = () => {
    let text = `${comparison.name}: `;

    let profit = String(useCompareText(
      comparison.base,
      comparison.compare
    ));
    
    if (comparison.show_profit_per_trade && !isNaN(parseFloat(profit))) {
      let tradeCount = 1 + comparison.compare.length;
      let profitPerTrade = parseFloat(profit) / tradeCount;
      profit += ` (${profitPerTrade.toFixed(1)}/trade)`;
    };

    text += `${profit} chaos profit`;

    text += useCostText(comparison.compare);

    if (comparison.comment) {
      text += ` (${comparison.comment})`;
    }

    return text;
  };

  return <label>{ComparisonText()}</label>;
};

Comparison.propTypes = {
  comparison: PropTypes.object,
  selectedLeague: PropTypes.string,
};
