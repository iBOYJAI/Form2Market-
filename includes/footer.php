    <?php if ($layout_mode === 'dashboard'): ?>
    </main>
</div>
<?php endif; ?>

<script src="<?= BASE_URL ?>assets/js/main.js"></script>
<?php if ($layout_mode === 'dashboard'): ?>
<script>
// Toggle notification panel
document.getElementById('notif-trigger')?.addEventListener('click', function(e) {
    document.getElementById('notif-panel')?.classList.toggle('open');
    e.stopPropagation();
});
document.addEventListener('click', () => document.getElementById('notif-panel')?.classList.remove('open'));
</script>
<?php endif; ?>

</body>
</html>
