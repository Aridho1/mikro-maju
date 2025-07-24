import { config } from "./getConfigJson.js";

const { max_data: _max_data, max_button: _max_button } = config.pagination;

export default function Pagination(max_data = _max_data, max_button = _max_button) {
    return {
        page: 1,
        total_data: 5,
        total_page: 1,

        start_index: 1,
        end_index: 1,

        max_data,
        max_button,

        _buttons: [],

        get buttons() {
            const { page, total_page, max_button } = this;

            const buttons =
                ((total_page <= max_button || page - ~~(max_button / 2) < ~~(max_button / 2)) &&
                    (console.error("case 1") ||
                        Array(total_page <= max_button ? total_page : max_button)
                            .fill(2)
                            .map((_, i) => i + 1))) ||
                (page <= total_page - ~~(max_button / 2) &&
                    (console.error("case 2") ||
                        Array(max_button)
                            .fill(2)
                            .map((_, i) => i + page - ~~(max_button / 2)))) ||
                console.error("case 3") ||
                Array(max_button)
                    .fill(2)
                    .map((_, i) => total_page - max_button + 1 + i);

            this._buttons = buttons;
            return buttons;
        },
    };
}
