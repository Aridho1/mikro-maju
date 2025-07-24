<?php

class Pagination
{
    private $page, $max_data, $max_button, $total_data, $total_page, $start_index, $end_index, $offset;

    public function Pagination($page, int $max_data, int $max_button): static
    {

        if (is_nan($page)) {
            throw new ErrorException("page must be an number!");
        }

        $page = $page < 1 ? 1 : $page;

        $this->page = $page;
        $this->max_data = $max_data;
        $this->max_button = $max_button;

        $this->offset = ($page - 1) * $max_data;


        return $this;
    }

    public function getOffset()
    {
        return $this->offset;
    }

    public function setTotalData(int $total_data)
    {
        $this->total_data = $total_data;
        $total_page = ceil($total_data / $this->max_data);

        $this->offset = ($this->page - 1) * $this->max_data;
        $this->offset = $this->offset < 0 ? 0 : $this->offset;

        $this->start_index = $this->total_data == 0 ? 0 : $this->offset + 1;
        $this->end_index = $this->offset + $this->max_data > $this->total_data ? $this->total_data : $this->offset + $this->max_data;
    }

    public function getAsJSON()
    {
        return json_encode($this);
    }


}