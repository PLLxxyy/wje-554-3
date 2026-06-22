import { Alert, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderStatus, UserRole, WarrantyStatus } from '../constants/enums';
import { OrderStatusFlow } from '../components/common/OrderStatusFlow';
import { PageHeader } from '../components/common/PageHeader';
import { RatingStars } from '../components/common/RatingStars';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';
import { datetime, money } from '../utils/format';

export function OrderDetail() {
  const { id = '' } = useParams();
  const role = useAuthStore((state) => state.user?.role);
  const { current, loadOrder, updateStatus, cancel, rate, rework } = useOrderStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('服务准时，沟通顺畅。');

  useEffect(() => { loadOrder(id); }, [id, loadOrder]);

  const actions = useMemo(() => {
    if (!current) return [];
    if (role === UserRole.WORKER) {
      const map: Partial<Record<OrderStatus, [string, OrderStatus]>> = {
        [OrderStatus.ASSIGNED]: ['接单', OrderStatus.ACCEPTED],
        [OrderStatus.ACCEPTED]: ['出发', OrderStatus.ON_THE_WAY],
        [OrderStatus.ON_THE_WAY]: ['开始服务', OrderStatus.IN_PROGRESS],
        [OrderStatus.IN_PROGRESS]: ['完工', OrderStatus.COMPLETED]
      };
      return map[current.status] ? [map[current.status]!] : [];
    }
    if (role === UserRole.ADMIN && current.status === OrderStatus.PENDING) return [['派单给默认技师', OrderStatus.ASSIGNED] as [string, OrderStatus]];
    return [];
  }, [current, role]);

  if (!current) return null;

  return (
    <>
      <PageHeader
        title="订单详情"
        subtitle={current.orderNo}
        actions={<Stack direction="row" spacing={1}>
          {current.warrantyStatus !== WarrantyStatus.NONE && <StatusBadge value={current.warrantyStatus} />}
          <StatusBadge value={current.status} />
        </Stack>}
      />
      {current.warrantyStatus === WarrantyStatus.ACTIVE && (
        <Alert severity="info" sx={{ mb: 2 }}>
          当前订单在保障期内，剩余 {current.warrantyRemainingDays} 天，可免费申请返修一次。
        </Alert>
      )}
      {current.warrantyStatus === WarrantyStatus.USED && (
        <Alert severity="success" sx={{ mb: 2 }}>该订单已使用返修保障。</Alert>
      )}
      {current.warrantyStatus === WarrantyStatus.EXPIRED && (
        <Alert severity="warning" sx={{ mb: 2 }}>订单 7 天保障期已结束，若有问题请重新下单。</Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card><CardContent>
            <Typography variant="h5">{current.serviceItem.name}</Typography>
            <Typography color="text.secondary">{current.serviceItem.description}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}><Typography>价格：{money(current.totalPrice)}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography>预约：{datetime(current.scheduledTime)}</Typography></Grid>
              <Grid item xs={12}><Typography>地址：{current.address}{current.addressDetail}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography>联系电话：{current.contactPhone}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography>技师：{current.worker?.name || '待派单'}</Typography></Grid>
              {current.completedAt && <Grid item xs={12} md={6}><Typography>完工时间：{datetime(current.completedAt)}</Typography></Grid>}
              {current.warrantyStatus !== WarrantyStatus.NONE && (
                <Grid item xs={12} md={6}>
                  <Typography>
                    保障状态：<StatusBadge value={current.warrantyStatus} />
                    {current.warrantyStatus === WarrantyStatus.ACTIVE && ` · 剩余 ${current.warrantyRemainingDays} 天`}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Box sx={{ my: 4, overflowX: 'auto' }}><OrderStatusFlow status={current.status} /></Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {actions.map(([label, next]) => <Button key={next} variant="contained" onClick={() => updateStatus(current.id, next)}>{label}</Button>)}
              {role === UserRole.CUSTOMER && current.warrantyStatus === WarrantyStatus.ACTIVE && (
                <Button color="primary" variant="outlined" onClick={() => rework(current.id)}>申请返修（免费）</Button>
              )}
              {role !== UserRole.WORKER && ![OrderStatus.CANCELLED, OrderStatus.RATED].includes(current.status) && <Button color="error" variant="outlined" onClick={() => cancel(current.id, '用户取消')}>取消订单</Button>}
            </Stack>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}><CardContent>
            <Typography variant="h6">地图定位</Typography>
            <Box sx={{ height: 220, mt: 2, borderRadius: 2, bgcolor: '#dfe7de', display: 'grid', placeItems: 'center', color: 'text.secondary' }}>{current.address}</Box>
          </CardContent></Card>
          <Card><CardContent>
            <Typography variant="h6">评价</Typography>
            {current.status === OrderStatus.COMPLETED && role === UserRole.CUSTOMER ? (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <RatingStars value={rating} onChange={setRating} />
                <TextField multiline minRows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button variant="contained" onClick={() => rate(current.id, rating, comment)}>提交评价</Button>
              </Stack>
            ) : current.rating ? (
              <Stack spacing={1} sx={{ mt: 2 }}><RatingStars value={current.rating} readOnly /><Typography>{current.comment}</Typography></Stack>
            ) : <Typography color="text.secondary" sx={{ mt: 2 }}>完工后客户可评价。</Typography>}
          </CardContent></Card>
        </Grid>
      </Grid>
    </>
  );
}
