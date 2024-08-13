import {
  DataTable,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { type FetchResponse, isDesktop, useLayoutType, useServerPagination } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useState } from 'react';
import { getTestData } from './test-table.resource';
import { useTranslation } from 'react-i18next';
import styles from './test-table.scss';

export function TestTablePage() {
  return (
    <div className={styles.blah}>
      <TestTable />
    </div>
  );
}

export function TestTable() {
  const pageSizes = [10, 20, 50];
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const { goTo, data, currentPage, paginated, totalCount } = useServerPagination('/', currentPageSize, (url) =>
    getTestData(url).then((data) => ({ data }) as FetchResponse),
  );
  const layout = useLayoutType();
  const responsiveSize = isDesktop(layout) ? 'sm' : 'lg';
  const { t } = useTranslation();

  return (
    <DataTable
      data-floating-menu-container
      overflowMenuOnHover={isDesktop(layout)}
      rows={data?.results?.map((row) => ({ id: row + '', index: row, value: row })) ?? []}
      headers={[
        { key: 'index', header: 'index' },
        { key: 'value', header: 'value' },
      ]}
      size={responsiveSize}
      useZebraStyles
    >
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getToolbarProps, getExpandHeaderProps }) => (
        <>
          <TableContainer className={styles.tableContainer}>
            <Table {...getTableProps()} className={styles.queueTable} useZebraStyles>
              <TableHead>
                <TableRow>
                  {headers.map((header, i) => (
                    <TableHeader key={i} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={classNames({
                              'cds--table-column-menu': cell?.id?.split(':')?.[1] === 'actions',
                            })}
                          >
                            {cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {paginated && (
            <Pagination
              forwardText={t('nextPage', 'Next page')}
              backwardText={t('previousPage', 'Previous page')}
              page={currentPage}
              pageSize={currentPageSize}
              pageSizes={pageSizes}
              totalItems={totalCount}
              onChange={({ pageSize, page }) => {
                if (pageSize !== currentPageSize) {
                  setCurrentPageSize(pageSize);
                }
                if (page !== currentPage) {
                  goTo(page);
                }
              }}
            />
          )}
        </>
      )}
    </DataTable>
  );
}
